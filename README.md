# Docusaurus Themes

25 reusable React/TypeScript page layouts for a Docusaurus 3.10 knowledge hub — built for bank/tech teams.

All layouts work in light and dark mode (Deep Navy + Sky Blue brand palette). Covers runbooks, ADRs, compliance evidence, code walkthroughs, and more.

---

## Layouts

**Ops & Incidents**
- `MetaBlock` — page header (owner, team, status, last updated, tags)
- `InfoPanel` — 6-type callout: info / success / warning / danger / note / tip
- `RunbookStep` — numbered incident step with command copy block
- `ServiceDashboard` — live service health: operational / degraded / outage
- `ApiTryIt` — inline API request tester with live response

**Architecture & Decisions**
- `ADR` — Architecture Decision Record (context / decision / consequences / alternatives)
- `DecisionTable` — options comparison with highlighted winner

**Team & Collaboration**
- `MeetingNotes` — meeting metadata + action items
- `RetroBoard` — Start / Stop / Continue / Action retrospective board
- `TeamGrid` / `TeamCard` — team directory with on-call indicator
- `OnCallRota` — on-call schedule with current badge

**Compliance & Governance**
- `ChangeRequest` — CAB change record with 3-tab layout
- `IncidentPostMortem` — PIR with timeline + action items
- `SDLCGateChecklist` — release gate tracker with progress bar
- `ITControlEvidence` — SOX/ITGC audit evidence log

**Docs as Code**
- `CodeWalkthrough` — annotated code tour with step navigation
- `ChangelogPage` — release history with filter chips
- `EnvironmentReference` — env var docs with search + secret masking
- `ArchitectureDiagram` — Mermaid diagram with dark mode support
- `CodeSnippetLibrary` — searchable tagged code snippet gallery

---

## Using a Layout

Import from the appropriate file in any `.mdx` doc:

```mdx
import { MetaBlock, InfoPanel, RunbookStep } from '@site/src/components/PageLayouts';
import { ChangeRequest, IncidentPostMortem } from '@site/src/components/PageLayouts/wave5';
import { CodeWalkthrough, ArchitectureDiagram } from '@site/src/components/PageLayouts/wave6';
```

Live demos for every layout are in `docs-site/docs/templates/`.

---

## Quick Start

```bash
cd docs-site
npm install
npm start   # http://localhost:3000
```

---

## Claude Code

`.claude/` contains agent files and commands for reproducing every layout from scratch with Claude Code.

```bash
/init                  # bootstrap a fresh site with all 25 layouts
/add-layout            # scaffold a new ops/team layout
/add-layout-compliance # scaffold a new compliance layout
/add-layout-docs       # scaffold a new docs-as-code layout
```
