# Authoring Guide — Converting Confluence Pages to MDX

You are writing MDX pages for a Docusaurus knowledge hub. Each page is the
conversion of one Confluence page. Follow this guide exactly.

## Golden rules

1. **Prefer plain markdown.** Headings, paragraphs, bold/italic, lists,
   tables, links, and code blocks need NO components. Only reach for a brick
   when the source page has something markdown cannot express.
2. **One import line** at the top of the page, listing only the bricks you use:
   ```mdx
   import { Badge, Panel, Expand, PropertiesTable, TaskList,
            Figure, Attachments, Ticket, Mention, Columns, Column, Meta }
     from '@site/src/components/Bricks';
   ```
3. **Omit what you don't have.** Every optional prop can be left out — the
   brick hides that part. Never invent values to fill a prop.
4. **Never edit `sidebars.ts`, `docusaurus.config.ts`, or any CSS.** Adding a
   page = writing one `.mdx` file into the right folder. Nothing else.

## File placement (hierarchy)

The Confluence ancestor chain maps to folders under `docs/`:

```
Confluence: Data Platform > LakeBridge > Setup Guide
File:       docs/data-platform/lakebridge/setup-guide.mdx
```

- Folder and file names: kebab-case of the page title.
- A page that has children becomes `index.mdx` inside its own folder, and
  should end with `<DocCardList />` (import from `@theme/DocCardList`) to
  list its children — this replaces Confluence's "Children Display".
- To label/order a folder, add `_category_.json`:
  ```json
  { "label": "Data Platform", "position": 3,
    "link": { "type": "generated-index" } }
  ```

## Page skeleton

Every converted page starts like this:

```mdx
---
title: Setup Guide
---

import { Meta, Panel } from '@site/src/components/Bricks';

<Meta owner="Sai Kumar" lastUpdated="2026-06-11" status="Current" tags={['setup']} />

# Setup Guide

...content...
```

- `title` in frontmatter = the Confluence page title.
- `<Meta />` directly under the H1, filled from Confluence page metadata
  (author → `owner`, last modified date → `lastUpdated`).
- Optional frontmatter: `sidebar_position: N` to control ordering.

## The bricks

### `<Badge>` — Confluence status lozenge

```mdx
<Badge color="green">DONE</Badge>
<Badge color="yellow">IN PROGRESS</Badge>
```

Props: `color` = `grey | green | yellow | red | blue | purple` (default grey).
Children = the label text. Use inline within sentences or table cells.
Map Confluence lozenge colors 1:1.

### `<Panel>` — info/note/warning/success/error panel

```mdx
<Panel type="warning" title="Production access">
  All production access requires an approved ticket. **No exceptions.**
</Panel>
```

Props: `type` = `info | note | warning | success | error` (default info);
`title` optional (defaults to the type name). Body = markdown children.
Map Confluence panels: Info→info, Note→note, Warning→warning,
Success/Tip→success, Error→error.

### `<Expand>` — expand/collapse macro

```mdx
<Expand title="Full error log">

\`\`\`text
stack trace here
\`\`\`

</Expand>
```

Props: `title` (required), `defaultOpen` (optional, default false).
Body = markdown children. IMPORTANT: leave a blank line after the opening
tag and before the closing tag when the body contains markdown blocks
(code fences, lists) — otherwise MDX parses them as inline text.

### `<PropertiesTable>` — page properties / key-value block

```mdx
<PropertiesTable
  title="Deployment details"
  rows={[
    { name: 'Environment', value: 'Production' },
    { name: 'Owner', value: 'Data Platform' },
  ]}
/>
```

Props: `rows` = array of `{ name, value }` (both plain strings);
`title` optional. Values are text only — no markdown inside.

### `<TaskList>` — action items

```mdx
<TaskList
  title="Actions from the review"
  items={[
    { task: 'Update the runbook', owner: 'Priya Shah', due: '2026-06-20' },
    { task: 'Archive old dashboard', owner: 'James Wong', done: true },
  ]}
/>
```

Props: `items` = array of `{ task, owner?, due?, done? }`; `title` optional.
`due` is plain text (use ISO dates). Completed items render struck-through.

### `<Figure>` — image / draw.io diagram with caption

```mdx
<Figure src="/img/ingest-flow.png" caption="Trade ingest flow" width={560} />
```

Props: `src` (path under `static/`, e.g. `/img/x.png`), `caption?`, `alt?`,
`width?` (max pixels). Click-to-enlarge is automatic.
Place image files in `static/img/`. draw.io diagrams arrive pre-exported
as PNG — treat them as images.

### `<Attachments>` — attachment list

```mdx
<Attachments
  files={[
    { name: 'diagram.png', url: '/img/diagram.png' },
    { name: 'config.yaml', url: '/files/config.yaml', size: '4 KB' },
  ]}
/>
```

Props: `files` = array of `{ name, url, size? }`; `title?` (default
"Attachments"). Images render as thumbnails with click-to-enlarge; all other
extensions render as download rows — same behaviour as Confluence.
Place non-image files in `static/files/`, images in `static/img/`.

### `<Ticket>` — Jira issue reference

```mdx
<Ticket id="DATA-1042" status="In Progress" url="https://jira.internal/browse/DATA-1042" />
<Ticket id="DATA-1043" status="Done" statusColor="green" summary="Add S3 sink" />
```

Props: `id` (required); `url?` (omit to render unlinked); `status?`;
`statusColor?` (Badge colors, default blue); `summary?`. Use inline in
sentences. Map Jira macro statuses: Done→green, In Progress→blue or yellow,
Blocked→red.

### `<Mention>` — @mention

```mdx
Reviewed by <Mention name="Priya Shah" />.
```

Props: `name` only. Use inline wherever Confluence had @mentions.

### `<Columns>` / `<Column>` — column layout

```mdx
<Columns>
  <Column>
    **Before** — nightly batch, 26h freshness.
  </Column>
  <Column>
    **After** — streaming, 5-minute freshness.
  </Column>
</Columns>
```

Columns share width equally and stack on small screens. Use only when the
source page genuinely used a column layout.

### `<Meta>` — page byline

```mdx
<Meta owner="Sai Kumar" lastUpdated="2026-06-11" status="Current"
      statusColor="green" tags={['runbook', 'p1']} />
```

All props optional: `owner`, `lastUpdated`, `status`, `statusColor`, `tags`.
Use once per page, directly under the H1.

### `<DocCardList>` — children display (built into Docusaurus)

```mdx
import DocCardList from '@theme/DocCardList';

<DocCardList />
```

Use at the end of parent pages (`index.mdx`) to list child pages as cards.

## MDX pitfalls — read carefully

1. **Code fences inside JSX children need blank lines** around them (see
   `<Expand>` above), and the component tags must not be indented.
2. **Never put triple backticks inside a JSX string prop.** If a prop needs
   multi-line text, define it first:
   ```mdx
   export const logText = `line one
   line two`;

   <SomeBrick text={logText} />
   ```
3. **Curly braces in prose are MDX expressions.** Escape literal `{` as
   `\{` in markdown text.
4. **Angle brackets in prose**: write `\<placeholder>` or wrap in backticks,
   or MDX treats it as JSX.
5. **String props with apostrophes**: use double quotes — `title="Jane's notes"`.
6. **Internal links between pages**: relative markdown links to the `.mdx`
   file — `[Setup Guide](./setup-guide.mdx)` — Docusaurus rewrites them.
7. **No external URLs.** Images, files, and links must be site-relative paths
   or internal (`*.internal`) hosts. Never reference public internet hosts.

## What NOT to convert

- Confluence comments, likes, page history → drop.
- "Recently updated" / dynamic macros → drop.
- Table of contents macro → drop (automatic right-rail TOC).
- Page Properties **Report** (cross-page aggregation) → write a static
  markdown table with the data, if the information matters.

## Worked example

See `docs/bricks-reference.mdx` for every brick used once, and
`docs/data-platform/lakebridge/` for a complete converted hierarchy
(parent + two children).
