/*
 * Static browser adapter for the original surgical-annotator frontend.
 *
 * It serves three disclosed LASK Trial46 fixtures and stores edits only in
 * localStorage. Every /api request is handled here, so the demo cannot call a
 * Flask server, model service, filesystem route, or administrative endpoint.
 */
(function installSurgicalDemoAdapter() {
    "use strict";

    const datasetName = "LASK v1.0 public demo";
    const trialName = "Trial46";
    const trialId = `${datasetName}/${trialName}`;
    const frames = [200, 1000, 1800];
    const storagePrefix = "research-with-ai:surgical-annotator-demo:v1:";
    const nativeFetch = window.fetch.bind(window);
    const seedCache = new Map();

    const fixtureByFrame = {
        200: {
            image: "./trial46_frame_0200.jpg",
            annotation: "./trial46_frame_0200.json"
        },
        1000: {
            image: "./trial46_frame_1000.jpg",
            annotation: "./trial46_frame_1000.json"
        },
        1800: {
            image: "./trial46_frame_1800.jpg",
            annotation: "./trial46_frame_1800.json"
        }
    };

    const phaseDefinitions = {
        coarse_phases: [
            "idle", "reach", "nudge", "grasp", "transfer", "place", "dropped"
        ],
        fine_phases: {
            idle: ["waiting", "planning", "repositioning"],
            reach: ["approach_peg", "open_jaw_prepare", "approach_target_post"],
            nudge: ["align_peg", "push_peg", "reposition_peg"],
            grasp: ["position_jaw", "close_jaw", "lift_peg", "verify_grasp"],
            transfer: ["approach_partner", "align_tools", "handoff", "verify_transfer"],
            place: ["approach_post", "align_peg", "release_peg", "verify_place"],
            dropped: ["peg_dropped"]
        },
        atomic_events: [
            "jaw_open", "jaw_close", "peg_contact", "peg_release",
            "tool_contact", "fumble", "peg_drop", "correction",
            "hesitation", "regrasp", "wrong_placement", "collision"
        ],
        peg_states: [
            "on_source_post", "grasped_by_tool1", "grasped_by_tool2",
            "in_transfer", "on_target_post", "dropped", "out_of_view"
        ],
        num_pegs: 6,
        phase_colors: {
            idle: {bg: "#6b7280", text: "#fff"},
            reach: {bg: "#3b82f6", text: "#fff"},
            nudge: {bg: "#f97316", text: "#fff"},
            grasp: {bg: "#f59e0b", text: "#000"},
            transfer: {bg: "#8b5cf6", text: "#fff"},
            place: {bg: "#10b981", text: "#fff"},
            dropped: {bg: "#ef4444", text: "#fff"}
        }
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function jsonResponse(value, status = 200) {
        return new Response(JSON.stringify(value), {
            status,
            headers: {"Content-Type": "application/json"}
        });
    }

    function frameFromPath(pathname) {
        const matches = [...pathname.matchAll(/\/(\d+)(?:\/|$)/g)];
        if (matches.length === 0) return frames[0];
        const candidate = Number(matches[matches.length - 1][1]);
        return frames.includes(candidate) ? candidate : frames[0];
    }

    async function seedForFrame(frameIdx) {
        if (!seedCache.has(frameIdx)) {
            const fixture = fixtureByFrame[frameIdx] || fixtureByFrame[frames[0]];
            seedCache.set(
                frameIdx,
                nativeFetch(new URL(fixture.annotation, window.location.href))
                    .then((response) => response.json())
            );
        }
        return clone(await seedCache.get(frameIdx));
    }

    async function annotationForFrame(frameIdx) {
        try {
            const saved = window.localStorage.getItem(`${storagePrefix}${frameIdx}`);
            return saved ? JSON.parse(saved) : await seedForFrame(frameIdx);
        } catch {
            return seedForFrame(frameIdx);
        }
    }

    function saveAnnotation(frameIdx, value) {
        window.localStorage.setItem(
            `${storagePrefix}${frameIdx}`,
            JSON.stringify(value)
        );
    }

    function progressRecord() {
        return {
            trial_id: trialId,
            trial_name: trialName,
            total: frames.length,
            completed: frames.length,
            skipped: 0,
            excluded: 0,
            negative: 0,
            partial: 0,
            broken: 0,
            remaining: 0,
            percentage: 100,
            phase_total: frames.length,
            phase_completed: frames.length,
            phase_percentage: 100,
            peg_total: frames.length,
            peg_completed: 0,
            peg_percentage: 0
        };
    }

    async function phaseSummary() {
        const summary = {};
        for (const frameIdx of frames) {
            const annotation = await annotationForFrame(frameIdx);
            summary[String(frameIdx)] = annotation.phase || {};
        }
        return summary;
    }

    window.__annotationDemoFrameUrl = function annotationDemoFrameUrl(frameIdx) {
        const fixture = fixtureByFrame[Number(frameIdx)] || fixtureByFrame[frames[0]];
        return new URL(fixture.image, window.location.href).href;
    };

    window.fetch = async function demoFetch(input, init = {}) {
        const raw = typeof input === "string" ? input : input.url;
        const url = new URL(raw, window.location.href);
        if (!url.pathname.startsWith("/api/")) {
            return nativeFetch(input, init);
        }

        const path = decodeURIComponent(url.pathname.slice(4));
        const method = String(init.method || "GET").toUpperCase();

        if (path === "/datasets") {
            return jsonResponse([{name: datasetName, trials: [trialName]}]);
        }
        if (path === "/datasets/progress") {
            return jsonResponse([{
                name: datasetName,
                percentage: 100,
                trials: [progressRecord()]
            }]);
        }
        if (path.startsWith(`/datasets/${datasetName}/refresh_progress`)) {
            return jsonResponse({
                name: datasetName,
                percentage: 100,
                trials: [progressRecord()]
            });
        }
        if (path === "/phase_definitions") {
            return jsonResponse(phaseDefinitions);
        }
        if (path.endsWith("/frames_lite")) {
            return jsonResponse({
                sampled_frames: frames,
                annotation_file_count: 0,
                progress: progressRecord()
            });
        }
        if (path.endsWith("/all_frames")) {
            return jsonResponse({all_frames: frames});
        }
        if (path.endsWith("/frames")) {
            return jsonResponse({
                sampled_frames: frames,
                progress: progressRecord()
            });
        }
        if (path.endsWith("/frame_status")) {
            return jsonResponse({
                "200": "completed",
                "1000": "completed",
                "1800": "completed"
            });
        }
        if (path.endsWith("/phase_summary")) {
            return jsonResponse(await phaseSummary());
        }
        if (path === "/sam/status") {
            return jsonResponse({
                available: false,
                reason: "Model services are not included in this static demo."
            });
        }
        if (path.startsWith("/sam/availability/")) {
            return jsonResponse({"200": false, "1000": false, "1800": false});
        }
        if (path.startsWith("/sam/precomputed/") || path.startsWith("/sam/compute/")) {
            return jsonResponse({available: false, polygons: []});
        }
        if (path.endsWith("/visibility")) {
            return jsonResponse({});
        }
        if (path.includes("/latest-peg-frame")) {
            return jsonResponse({found: false});
        }
        if (path.endsWith("/backup") && method === "POST") {
            const annotations = {};
            for (const frameIdx of frames) {
                annotations[String(frameIdx)] = await annotationForFrame(frameIdx);
            }
            window.localStorage.setItem(
                `${storagePrefix}backup`,
                JSON.stringify({
                    created_at: new Date().toISOString(),
                    annotations
                })
            );
            return jsonResponse({
                success: true,
                path: "browser storage only"
            });
        }
        if (path.endsWith("/phase_bulk") || path.endsWith("/batch")) {
            return jsonResponse({success: true, count: 0});
        }
        if (path.endsWith("/batch-broken")) {
            return jsonResponse({success: true, count: 0});
        }
        if (path.endsWith("/batch-copy-pegs")) {
            return jsonResponse({success: true, count: 0});
        }

        const frameIdx = frameFromPath(path);

        if (path.endsWith("/annotation_single")) {
            return jsonResponse({
                annotation: await annotationForFrame(frameIdx),
                prior: null,
                kinematics: null
            });
        }
        if (path.endsWith("/annotations")) {
            if (method === "POST") {
                const value = JSON.parse(init.body || "{}");
                saveAnnotation(frameIdx, {...value, frame_idx: frameIdx});
                return jsonResponse({success: true, storage: "local-only"});
            }
            const annotation = await annotationForFrame(frameIdx);
            const priorPosition = Math.max(0, frames.indexOf(frameIdx) - 1);
            return jsonResponse({
                annotation,
                prior: frameIdx === frames[0]
                    ? null
                    : await annotationForFrame(frames[priorPosition]),
                kinematics: null
            });
        }
        if (path.endsWith("/skip")) {
            const annotation = await annotationForFrame(frameIdx);
            annotation.skipped = true;
            saveAnnotation(frameIdx, annotation);
            return jsonResponse({success: true});
        }
        if (path.endsWith("/unskip")) {
            const annotation = await annotationForFrame(frameIdx);
            annotation.skipped = false;
            saveAnnotation(frameIdx, annotation);
            return jsonResponse({success: true});
        }
        if (path.endsWith("/ensure_init")) {
            return jsonResponse({initialized: false});
        }

        return jsonResponse(
            {error: "This server endpoint is unavailable in the static demo."},
            404
        );
    };

    class DemoEventSource {
        constructor() {
            this.listeners = new Map();
            setTimeout(() => {
                const listener = this.listeners.get("done");
                if (listener) {
                    listener({data: JSON.stringify({loaded: 3, total: 3})});
                }
            }, 25);
        }

        addEventListener(name, callback) {
            this.listeners.set(name, callback);
        }

        close() {}
    }

    window.EventSource = DemoEventSource;

    function resetDemo() {
        const scopedKeys = [];
        for (let index = 0; index < window.localStorage.length; index += 1) {
            const key = window.localStorage.key(index);
            if (key?.startsWith(storagePrefix)) scopedKeys.push(key);
        }
        scopedKeys.forEach((key) => window.localStorage.removeItem(key));
        ["useEdgeSelection", "autoAdvance", "manualMaskMode"].forEach((key) => {
            window.localStorage.removeItem(key);
        });
        window.location.reload();
    }

    document.getElementById("resetDemoBtn")?.addEventListener("click", resetDemo);

    function autoStart() {
        const datasetSelect = document.getElementById("dataset-select");
        if (!datasetSelect || datasetSelect.options.length < 2) {
            window.setTimeout(autoStart, 50);
            return;
        }

        datasetSelect.value = datasetName;
        datasetSelect.dispatchEvent(new Event("change", {bubbles: true}));

        const chooseTrial = () => {
            const trialSelect = document.getElementById("trial-select");
            if (!trialSelect || trialSelect.options.length < 2) {
                window.setTimeout(chooseTrial, 50);
                return;
            }
            trialSelect.value = trialId;
            trialSelect.dispatchEvent(new Event("change", {bubbles: true}));
        };

        window.setTimeout(chooseTrial, 25);
    }

    window.addEventListener("load", () => {
        window.setTimeout(autoStart, 0);
    });
})();
