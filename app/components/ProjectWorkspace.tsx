"use client";

import { useEffect, useRef, useState } from "react";
import type {
  StoredWorkshopWorkspace,
  WorkshopProject,
} from "@/lib/types";

type EditorMode = "closed" | "new" | "rename";

export function ProjectWorkspace({
  activeProject,
  onCreate,
  onRename,
  onSelect,
  onUpdateNotes,
  workspace,
}: {
  activeProject: WorkshopProject;
  onCreate: (name: string) => void;
  onRename: (name: string) => void;
  onSelect: (projectId: string) => void;
  onUpdateNotes: (notes: string) => void;
  workspace: StoredWorkshopWorkspace;
}) {
  const [mode, setMode] = useState<EditorMode>("closed");
  const [name, setName] = useState(activeProject.name);
  const [status, setStatus] = useState("Saved locally on this browser");
  const hasNotes = activeProject.notes.trim().length > 0;
  const [notesOpen, setNotesOpen] = useState(hasNotes);
  const previousProjectId = useRef(activeProject.id);

  useEffect(() => {
    setName(activeProject.name);
    setMode("closed");
    setStatus("Saved locally on this browser");
  }, [activeProject.id, activeProject.name]);

  useEffect(() => {
    if (previousProjectId.current !== activeProject.id) {
      previousProjectId.current = activeProject.id;
      setNotesOpen(hasNotes);
      return;
    }
    if (hasNotes) {
      setNotesOpen((current) => current || hasNotes);
    }
  }, [activeProject.id, hasNotes]);

  function openEditor(nextMode: Exclude<EditorMode, "closed">) {
    setName(nextMode === "rename" ? activeProject.name : "");
    setMode(nextMode);
  }

  function submitName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.replace(/\s+/g, " ").trim();
    if (!nextName) return;
    if (mode === "new") onCreate(nextName);
    if (mode === "rename") onRename(nextName);
    setMode("closed");
  }

  return (
    <section
      aria-labelledby="project-workspace-title"
      className="project-workspace"
      id="project-workspace"
    >
      <div className="project-workspace-heading">
        <div>
          <p>Active project</p>
          <h2 id="project-workspace-title">{activeProject.name}</h2>
        </div>
        <p>
          Progress, decisions, notes, assessment, and builder drafts are kept
          separately for this project in this browser on this workshop site.
        </p>
      </div>

      <div className="project-workspace-controls">
        <label>
          <span>Choose a project</span>
          <select
            onChange={(event) => onSelect(event.target.value)}
            value={workspace.activeProjectId}
          >
            {workspace.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <div aria-label="Project actions" className="project-actions">
          <button onClick={() => openEditor("new")} type="button">
            New project
          </button>
          <button onClick={() => openEditor("rename")} type="button">
            Rename
          </button>
        </div>
      </div>

      {mode !== "closed" ? (
        <form className="project-name-editor" onSubmit={submitName}>
          <label htmlFor="project-name">
            {mode === "new" ? "Name the new project" : "Rename this project"}
          </label>
          <div>
            <input
              autoFocus
              id="project-name"
              maxLength={80}
              onChange={(event) => setName(event.target.value)}
              placeholder="For example, reproduce the phase baseline"
              value={name}
            />
            <button disabled={!name.trim()} type="submit">
              {mode === "new" ? "Create and switch" : "Save name"}
            </button>
            <button onClick={() => setMode("closed")} type="button">
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <details
        className="project-notes-disclosure"
        key={activeProject.id}
        onToggle={(event) => setNotesOpen(event.currentTarget.open)}
        open={notesOpen}
      >
        <summary className="project-notes-summary">
          <span className="project-notes-summary-copy">
            <strong>Project notes</strong>
            <span>Questions, links, decisions, and reminders for this project.</span>
          </span>
          <small className="project-notes-summary-status">
            {hasNotes ? "Notes saved" : "No notes yet"}
          </small>
        </summary>
        <div className="project-notes-panel">
          <label className="project-notes">
            <span>
              Notes for {activeProject.name}
              <small aria-live="polite">{status}</small>
            </span>
            <textarea
              maxLength={12000}
              onChange={(event) => {
                onUpdateNotes(event.target.value);
                setStatus("Saved locally on this browser");
              }}
              onFocus={() => setStatus("Editing")}
              onBlur={() => setStatus("Saved locally on this browser")}
              placeholder="Keep questions, decisions, links, and reminders here. Do not store secrets or identifiable data."
              rows={4}
              value={activeProject.notes}
            />
          </label>
          <p className="project-storage-note">
            These notes use unencrypted local browser storage on the current
            workshop site. This is not a shared notebook or a backup. Do not
            enter confidential research data, patient information, or secrets.
            Export the working record for a durable project file.
          </p>
        </div>
      </details>
    </section>
  );
}
