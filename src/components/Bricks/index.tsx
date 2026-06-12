/**
 * Bricks — small, composable page components mirroring Confluence's
 * most-used elements. Each brick stands alone: use any of them, in any
 * order, anywhere in an MDX page. Plain markdown handles everything else
 * (headings, paragraphs, lists, tables, code blocks).
 *
 * Design rules (do not break these when editing):
 * - Zero dependencies beyond React. No network calls. No external URLs.
 * - Props are plain data (strings / arrays / enums) wherever possible.
 *   `children` is used only where rich markdown content belongs inside
 *   (Panel, Expand, Columns) — MDX renders markdown children natively.
 * - Every optional prop, when omitted, simply hides its element.
 * - All colors via CSS module classes with dark-mode overrides. Never
 *   inline background styles.
 *
 * Confluence element → brick:
 *   Status lozenge        → <Badge>
 *   Info/Note/Warning…    → <Panel>
 *   Expand macro          → <Expand>
 *   Page properties       → <PropertiesTable>
 *   Action items / tasks  → <TaskList>
 *   Image / drawio PNG    → <Figure>
 *   Attachments           → <Attachments>
 *   Jira issue link       → <Ticket>
 *   @mention              → <Mention>
 *   Two-column layout     → <Columns> / <Column>
 *   Page byline           → <Meta>
 */
import React, { useState, type ReactNode } from 'react';
import styles from './bricks.module.css';

/* ───────────────────────── Badge ─────────────────────────
 * Confluence status lozenge. Same six colors Confluence offers.
 *
 *   <Badge color="green">DONE</Badge>
 *   <Badge color="yellow">IN PROGRESS</Badge>
 */
type BadgeColor = 'grey' | 'green' | 'yellow' | 'red' | 'blue' | 'purple';

interface BadgeProps {
  /** Lozenge color. Default "grey". */
  color?: BadgeColor;
  /** The label text, e.g. "DONE", "IN PROGRESS", "BLOCKED". */
  children: ReactNode;
}

export function Badge({ color = 'grey', children }: BadgeProps) {
  const cls = {
    grey: styles.badgeGrey,
    green: styles.badgeGreen,
    yellow: styles.badgeYellow,
    red: styles.badgeRed,
    blue: styles.badgeBlue,
    purple: styles.badgePurple,
  }[color];
  return <span className={`${styles.badge} ${cls}`}>{children}</span>;
}

/* ───────────────────────── Panel ─────────────────────────
 * Confluence info/note/warning/success/error panel.
 * Body is markdown children.
 *
 *   <Panel type="warning" title="Heads up">
 *     Clusters auto-terminate after **60 minutes** idle.
 *   </Panel>
 */
type PanelType = 'info' | 'note' | 'warning' | 'success' | 'error';

interface PanelProps {
  /** Panel flavour. Default "info". */
  type?: PanelType;
  /** Optional bold title line. Omit for a body-only panel. */
  title?: string;
  /** Panel body — write markdown directly inside the tag. */
  children: ReactNode;
}

const PANEL_CONFIG: Record<PanelType, { icon: string; cls: string; defaultTitle: string }> = {
  info:    { icon: 'ℹ️', cls: 'panelInfo',    defaultTitle: 'Info' },
  note:    { icon: '📝', cls: 'panelNote',    defaultTitle: 'Note' },
  warning: { icon: '⚠️', cls: 'panelWarning', defaultTitle: 'Warning' },
  success: { icon: '✅', cls: 'panelSuccess', defaultTitle: 'Success' },
  error:   { icon: '🚨', cls: 'panelError',   defaultTitle: 'Error' },
};

export function Panel({ type = 'info', title, children }: PanelProps) {
  const cfg = PANEL_CONFIG[type];
  return (
    <div className={`${styles.panel} ${styles[cfg.cls]}`}>
      <div className={styles.panelTitle}>
        <span aria-hidden="true">{cfg.icon}</span> {title ?? cfg.defaultTitle}
      </div>
      <div className={styles.panelBody}>{children}</div>
    </div>
  );
}

/* ───────────────────────── Expand ─────────────────────────
 * Confluence expand macro. Collapsed by default.
 *
 *   <Expand title="Full error log">
 *     ```text
 *     stack trace here…
 *     ```
 *   </Expand>
 */
interface ExpandProps {
  /** The always-visible header line. */
  title: string;
  /** Start opened instead of collapsed. Default false. */
  defaultOpen?: boolean;
  /** Hidden content — write markdown directly inside the tag. */
  children: ReactNode;
}

export function Expand({ title, defaultOpen = false, children }: ExpandProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.expand}>
      <button
        type="button"
        className={styles.expandHeader}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={`${styles.expandChevron} ${open ? styles.expandChevronOpen : ''}`}>▸</span>
        {title}
      </button>
      {open && <div className={styles.expandBody}>{children}</div>}
    </div>
  );
}

/* ───────────────────── PropertiesTable ─────────────────────
 * Confluence page-properties / key-value block.
 *
 *   <PropertiesTable
 *     rows={[
 *       { name: 'Environment', value: 'Production' },
 *       { name: 'Owner', value: 'Data Platform' },
 *     ]}
 *   />
 */
interface PropertyRow {
  /** Property label, e.g. "Environment". */
  name: string;
  /** Property value as plain text, e.g. "Production". */
  value: string;
}

interface PropertiesTableProps {
  /** Optional heading shown above the table. */
  title?: string;
  rows: PropertyRow[];
}

export function PropertiesTable({ title, rows }: PropertiesTableProps) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className={styles.propsTableWrap}>
      {title && <div className={styles.propsTableTitle}>{title}</div>}
      <table className={styles.propsTable}>
        <tbody>
          {rows.map(r => (
            <tr key={r.name}>
              <th scope="row">{r.name}</th>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────────────────── TaskList ─────────────────────────
 * Confluence action items / task list.
 *
 *   <TaskList
 *     items={[
 *       { task: 'Review the design doc', owner: 'Priya', due: '2026-06-10' },
 *       { task: 'Update the runbook', owner: 'Sai', done: true },
 *     ]}
 *   />
 */
interface TaskItem {
  /** What needs doing. */
  task: string;
  /** Person responsible. Rendered as @mention. */
  owner?: string;
  /** Due date as plain text, e.g. "2026-06-10". */
  due?: string;
  /** Completed? Default false. */
  done?: boolean;
}

interface TaskListProps {
  /** Optional heading shown above the list. */
  title?: string;
  items: TaskItem[];
}

export function TaskList({ title, items }: TaskListProps) {
  if (!items || items.length === 0) return null;
  return (
    <div className={styles.taskList}>
      {title && <div className={styles.taskListTitle}>{title}</div>}
      {items.map((t, i) => (
        <div key={i} className={styles.taskItem}>
          <span className={styles.taskCheck} aria-hidden="true">{t.done ? '☑' : '☐'}</span>
          <span className={`${styles.taskText} ${t.done ? styles.taskTextDone : ''}`}>
            {t.task}
            {t.owner && <> <Mention name={t.owner} /></>}
            {t.due && <span className={styles.taskDue}>due {t.due}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Figure ─────────────────────────
 * Image or diagram (e.g. a draw.io export saved as PNG) with an
 * optional caption. Click to enlarge.
 * Put image files in static/img/ and reference as "/img/<name>.png".
 *
 *   <Figure src="/img/ingest-architecture.png" caption="Trade ingest flow" />
 */
interface FigureProps {
  /** Image path, e.g. "/img/diagram.png" (file in static/img/). */
  src: string;
  /** Alt text for accessibility. Falls back to the caption. */
  alt?: string;
  /** Caption shown under the image. */
  caption?: string;
  /** Max display width in pixels. Omit for full content width. */
  width?: number;
}

export function Figure({ src, alt, caption, width }: FigureProps) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <figure className={styles.figure} style={width ? { maxWidth: width } : undefined}>
      <button
        type="button"
        className={styles.figureButton}
        onClick={() => setZoomed(true)}
        title="Click to enlarge"
      >
        <img src={src} alt={alt ?? caption ?? ''} className={styles.figureImg} />
      </button>
      {caption && <figcaption className={styles.figureCaption}>{caption}</figcaption>}
      {zoomed && (
        <div className={styles.lightbox} onClick={() => setZoomed(false)} role="presentation">
          <img src={src} alt={alt ?? caption ?? ''} className={styles.lightboxImg} />
        </div>
      )}
    </figure>
  );
}

/* ───────────────────── Attachments ─────────────────────
 * Confluence attachments behaviour: images render as thumbnails
 * (click to enlarge); every other file type is a download row.
 * Put files in static/files/ and reference as "/files/<name>".
 *
 *   <Attachments
 *     files={[
 *       { name: 'architecture.png', url: '/img/architecture.png' },
 *       { name: 'config-export.yaml', url: '/files/config-export.yaml', size: '4 KB' },
 *       { name: 'capacity-plan.xlsx', url: '/files/capacity-plan.xlsx', size: '18 KB' },
 *     ]}
 *   />
 */
interface AttachmentFile {
  /** Display filename, e.g. "capacity-plan.xlsx". Extension drives the icon. */
  name: string;
  /** File path, e.g. "/files/capacity-plan.xlsx" (file in static/files/). */
  url: string;
  /** Human-readable size, e.g. "18 KB". Optional. */
  size?: string;
}

interface AttachmentsProps {
  /** Optional heading. Default "Attachments". */
  title?: string;
  files: AttachmentFile[];
}

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'];

function fileExtension(name: string): string {
  const base = name.split('/').pop() ?? name;
  const dot = base.lastIndexOf('.');
  return dot >= 0 ? base.slice(dot + 1).toLowerCase() : '';
}

function fileIcon(ext: string): string {
  if (['pdf'].includes(ext)) return '📕';
  if (['xls', 'xlsx', 'csv', 'tsv', 'ods'].includes(ext)) return '📊';
  if (['doc', 'docx', 'rtf', 'odt'].includes(ext)) return '📄';
  if (['ppt', 'pptx', 'odp'].includes(ext)) return '📽️';
  if (['zip', 'tar', 'gz', 'tgz', '7z', 'rar'].includes(ext)) return '🗜️';
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return '🎬';
  if (['txt', 'log', 'md'].includes(ext)) return '📃';
  return '📎';
}

export function Attachments({ title = 'Attachments', files }: AttachmentsProps) {
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  if (!files || files.length === 0) return null;

  const images = files.filter(f => IMAGE_EXTENSIONS.includes(fileExtension(f.name)));
  const others = files.filter(f => !IMAGE_EXTENSIONS.includes(fileExtension(f.name)));

  return (
    <div className={styles.attachments}>
      <div className={styles.attachmentsTitle}>📎 {title}</div>

      {images.length > 0 && (
        <div className={styles.attachmentsGrid}>
          {images.map(f => (
            <button
              key={f.url}
              type="button"
              className={styles.attachmentsThumbBtn}
              onClick={() => setZoomSrc(f.url)}
              title={`${f.name} — click to enlarge`}
            >
              <img src={f.url} alt={f.name} className={styles.attachmentsThumb} />
              <span className={styles.attachmentsThumbName}>{f.name}</span>
            </button>
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className={styles.attachmentsRows}>
          {others.map(f => (
            <a key={f.url} href={f.url} download className={styles.attachmentsRow}>
              <span aria-hidden="true">{fileIcon(fileExtension(f.name))}</span>
              <span className={styles.attachmentsRowName}>{f.name}</span>
              {f.size && <span className={styles.attachmentsRowSize}>{f.size}</span>}
              <span className={styles.attachmentsRowDl}>↓ Download</span>
            </a>
          ))}
        </div>
      )}

      {zoomSrc && (
        <div className={styles.lightbox} onClick={() => setZoomSrc(null)} role="presentation">
          <img src={zoomSrc} alt="" className={styles.lightboxImg} />
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Ticket ─────────────────────────
 * Jira (or any tracker) issue reference chip.
 *
 *   <Ticket id="DATA-1042" status="In Progress" url="https://jira.internal/browse/DATA-1042" />
 *   <Ticket id="DATA-1042" status="Done" statusColor="green" summary="Add S3 sink" />
 */
interface TicketProps {
  /** Issue key, e.g. "DATA-1042". */
  id: string;
  /** Link to the issue in your internal tracker. Omit to render unlinked. */
  url?: string;
  /** Status text shown in the lozenge, e.g. "In Progress". */
  status?: string;
  /** Lozenge color for the status. Default "blue". */
  statusColor?: BadgeColor;
  /** One-line issue summary shown after the key. */
  summary?: string;
}

export function Ticket({ id, url, status, statusColor = 'blue', summary }: TicketProps) {
  const inner = (
    <>
      <span className={styles.ticketIcon} aria-hidden="true">🎟️</span>
      <span className={styles.ticketId}>{id}</span>
      {summary && <span className={styles.ticketSummary}>{summary}</span>}
      {status && <Badge color={statusColor}>{status}</Badge>}
    </>
  );
  return url ? (
    <a href={url} className={styles.ticket}>{inner}</a>
  ) : (
    <span className={styles.ticket}>{inner}</span>
  );
}

/* ───────────────────────── Mention ─────────────────────────
 * Confluence @mention.
 *
 *   <Mention name="Priya Shah" />
 */
interface MentionProps {
  /** Person's display name. */
  name: string;
}

export function Mention({ name }: MentionProps) {
  return <span className={styles.mention}>@{name}</span>;
}

/* ──────────────────── Columns / Column ────────────────────
 * Confluence section/column layout. Columns share the width equally
 * and stack vertically on small screens.
 *
 *   <Columns>
 *     <Column>Left content — markdown works here.</Column>
 *     <Column>Right content.</Column>
 *   </Columns>
 */
interface ColumnsProps {
  children: ReactNode;
}

export function Columns({ children }: ColumnsProps) {
  return <div className={styles.columns}>{children}</div>;
}

interface ColumnProps {
  children: ReactNode;
}

export function Column({ children }: ColumnProps) {
  return <div className={styles.column}>{children}</div>;
}

/* ───────────────────────── Meta ─────────────────────────
 * Page byline — Confluence's "owned by X, last updated Y" header.
 * Place directly under the page title.
 *
 *   <Meta owner="Sai Kumar" lastUpdated="2026-06-03" status="Current" tags={['runbook', 'p1']} />
 */
interface MetaProps {
  /** Page owner / author display name. */
  owner?: string;
  /** Last updated date as plain text, e.g. "2026-06-03". */
  lastUpdated?: string;
  /** Page status shown as a lozenge, e.g. "Current", "Draft", "Deprecated". */
  status?: string;
  /** Lozenge color for the status. Default "green". */
  statusColor?: BadgeColor;
  /** Topic tags. */
  tags?: string[];
}

export function Meta({ owner, lastUpdated, status, statusColor = 'green', tags }: MetaProps) {
  if (!owner && !lastUpdated && !status && (!tags || tags.length === 0)) return null;
  return (
    <div className={styles.meta}>
      {owner && <span className={styles.metaItem}>👤 {owner}</span>}
      {lastUpdated && <span className={styles.metaItem}>🕐 Updated {lastUpdated}</span>}
      {status && <Badge color={statusColor}>{status}</Badge>}
      {tags && tags.map(t => <span key={t} className={styles.metaTag}>{t}</span>)}
    </div>
  );
}
