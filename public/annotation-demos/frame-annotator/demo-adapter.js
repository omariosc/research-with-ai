/*
 * Static browser adapter for the original frame-annotator interface.
 *
 * The Flask API is replaced with a local fixture and localStorage. Nothing is
 * uploaded and no network API is called. The original UI and interaction code
 * remain in index.html.
 */
(function installFrameDemoAdapter() {
    "use strict";

    const storageKey = "research-with-ai:frame-annotator-demo:v1";
    const frames = Array.from(
        {length: 10},
        (_, index) => `frame_${String(index).padStart(4, "0")}.png`
    );
    const starter = {
        clips: [{start: 0, end: 9, class: "1c"}]
    };
    const nativeFetch = window.fetch.bind(window);

    function jsonResponse(value, status = 200) {
        return new Response(JSON.stringify(value), {
            status,
            headers: {"Content-Type": "application/json"}
        });
    }

    function readSaved() {
        try {
            const stored = window.localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : structuredClone(starter);
        } catch {
            return structuredClone(starter);
        }
    }

    window.fetch = async function demoFetch(input, init = {}) {
        const raw = typeof input === "string" ? input : input.url;
        const url = new URL(raw, window.location.href);

        if (url.pathname === "/api/frames") {
            return jsonResponse({frames, total: frames.length});
        }

        if (url.pathname === "/api/load_annotations") {
            return jsonResponse(readSaved());
        }

        if (url.pathname === "/api/save_annotations") {
            try {
                const value = JSON.parse(init.body || "{\"clips\":[]}");
                window.localStorage.setItem(storageKey, JSON.stringify(value));
                return jsonResponse({
                    success: true,
                    message: "Saved in this browser only"
                });
            } catch {
                return jsonResponse(
                    {success: false, message: "Could not save local draft"},
                    400
                );
            }
        }

        if (url.pathname.startsWith("/api/")) {
            return jsonResponse(
                {error: "This server endpoint is unavailable in the static demo."},
                404
            );
        }

        return nativeFetch(input, init);
    };

    window.resetDemo = function resetDemo() {
        window.localStorage.removeItem(storageKey);
        window.location.reload();
    };

    window.addEventListener("load", () => {
        if (typeof window.showStatus === "function") {
            window.showStatus("Local browser demo. Save stays on this device.");
        }
    });
})();
