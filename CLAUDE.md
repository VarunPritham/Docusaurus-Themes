# Docusaurus Themes

25 reusable React/TypeScript page layouts for a Docusaurus 3.10 knowledge hub.

---

## Quick Start

```bash
cd docs-site && npm install && npm start   # http://localhost:3000
```

---

## Layout Files

| File | Exports |
|---|---|
| `docs-site/src/components/PageLayouts/index.tsx` | MetaBlock, InfoPanel, ADR, RunbookStep, ApiTryIt, ServiceDashboard, MeetingNotes, TeamGrid, TeamCard, DecisionTable, RetroBoard, OnCallRota |
| `docs-site/src/components/PageLayouts/wave5.tsx` | ChangeRequest, IncidentPostMortem, SDLCGateChecklist, ITControlEvidence |
| `docs-site/src/components/PageLayouts/wave6.tsx` | CodeWalkthrough, ChangelogPage, EnvironmentReference, ArchitectureDiagram, CodeSnippetLibrary, AttachmentPanel |
| `docs-site/src/components/PageLayouts/styles.module.css` | CSS for index.tsx components |
| `docs-site/src/components/PageLayouts/wave-styles.module.css` | CSS for wave5 + wave6 + AttachmentPanel |

---

## .claude/ Reference

### Commands

| Command | What it does |
|---|---|
| `/init` | Bootstrap a complete fresh site with all 25 layouts |
| `/add-layout` | Scaffold a new ops/team layout in index.tsx |
| `/add-layout-compliance` | Scaffold a new compliance layout in wave5.tsx |
| `/add-layout-docs` | Scaffold a new docs-as-code layout in wave6.tsx |

### Layout Agents (one per component)

| File | Component |
|---|---|
| `.claude/agents/layout-meta-block.md` | MetaBlock |
| `.claude/agents/layout-info-panel.md` | InfoPanel |
| `.claude/agents/layout-adr.md` | ADR |
| `.claude/agents/layout-runbook-step.md` | RunbookStep |
| `.claude/agents/layout-api-try-it.md` | ApiTryIt |
| `.claude/agents/layout-service-dashboard.md` | ServiceDashboard |
| `.claude/agents/layout-meeting-notes.md` | MeetingNotes |
| `.claude/agents/layout-team-grid.md` | TeamGrid / TeamCard |
| `.claude/agents/layout-decision-table.md` | DecisionTable |
| `.claude/agents/layout-retro-board.md` | RetroBoard |
| `.claude/agents/layout-on-call-rota.md` | OnCallRota |
| `.claude/agents/layout-change-request.md` | ChangeRequest |
| `.claude/agents/layout-incident-postmortem.md` | IncidentPostMortem |
| `.claude/agents/layout-sdlc-gate-checklist.md` | SDLCGateChecklist |
| `.claude/agents/layout-it-control-evidence.md` | ITControlEvidence |
| `.claude/agents/layout-code-walkthrough.md` | CodeWalkthrough |
| `.claude/agents/layout-changelog-page.md` | ChangelogPage |
| `.claude/agents/layout-environment-reference.md` | EnvironmentReference |
| `.claude/agents/layout-architecture-diagram.md` | ArchitectureDiagram |
| `.claude/agents/layout-code-snippet-library.md` | CodeSnippetLibrary |

### Attachment Agents

| File | Covers |
|---|---|
| `.claude/agents/attachment-image.md` | `.png .jpg .jpeg .gif .svg .webp .bmp .tiff .ico` |
| `.claude/agents/attachment-video.md` | `.mp4 .webm .mov .avi .mkv` + YouTube/Vimeo URLs |
| `.claude/agents/attachment-pdf.md` | `.pdf` |
| `.claude/agents/attachment-spreadsheet.md` | `.xlsx .xls .csv .ods .tsv` |
| `.claude/agents/attachment-document.md` | `.docx .doc .pptx .ppt .odt .odp .rtf` |
| `.claude/agents/attachment-archive.md` | `.zip .tar.gz .tar .gz .7z .rar .tgz` |
| `.claude/agents/attachment-config.md` | `.yaml .yml .json .toml .env .ini .conf .tf` + dotfiles |
| `.claude/agents/attachment-code.md` | `.py .ts .sh .sql .go .rs .java` and 15+ more |
| `.claude/agents/attachment-text.md` | `.txt .log .md .diff .patch .rst` |

### Rules

| File | Contents |
|---|---|
| `.claude/rules/00-firm-setup.md` | Full setup guide for replicating at your firm |
| `.claude/rules/06-layouts.md` | All 25 layouts — props, rendering, dark mode, usage |

---

## Dark Mode Rules

- Never use inline `style={{ background: '...' }}` for semantic colours
- All colour-coded CSS classes must have `[data-theme='dark']` `rgba()` overrides
- Code blocks always use `background: #0f172a` (hardcoded dark — intentional)
- Diagram wrappers use `background: transparent`
