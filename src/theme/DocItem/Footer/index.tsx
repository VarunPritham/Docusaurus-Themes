/**
 * Doc footer wrapper — adds the Slides button to the bottom of every doc page.
 *
 * The button talks to YOUR slide-generation backend (a Python service you run
 * separately). Configure its base URL in docusaurus.config.ts:
 *
 *   customFields: { slidesApi: 'http://localhost:8000' }
 *
 * Expected backend contract (two endpoints):
 *
 *   GET  {slidesApi}/slides/status?page=<docPath>
 *        → 200 {"exists": true,  "url": "http://localhost:3030"}
 *        → 200 {"exists": false}
 *
 *   POST {slidesApi}/slides/generate   body: {"page": "<docPath>"}
 *        → 200 {"url": "http://localhost:3030"}
 *
 * <docPath> is the page route, e.g. "/data-platform/lakebridge/setup-guide".
 *
 * Behaviour:
 *  - Slides already exist → "▶ Present slides" (opens them) + "↻ Regenerate"
 *  - No slides yet        → "⚡ Create slides" (generates, then opens)
 *  - Backend unreachable  → buttons still render; clicking shows the error
 */
import React, { useEffect, useState } from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

type Props = WrapperProps<typeof FooterType>;

function SlidesButton() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const apiBase = (siteConfig.customFields?.slidesApi as string) ?? 'http://localhost:8000';
  const page = location.pathname;

  const [slidesUrl, setSlidesUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ask the backend whether slides already exist for this page.
  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBase}/slides/status?page=${encodeURIComponent(page)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!cancelled && data?.exists && data?.url) setSlidesUrl(data.url);
      })
      .catch(() => {
        /* backend not running — buttons still render, generate will surface the error */
      });
    return () => { cancelled = true; };
  }, [apiBase, page]);

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/slides/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      });
      if (!res.ok) throw new Error(`Backend returned ${res.status}`);
      const data = await res.json();
      if (!data?.url) throw new Error('Backend response missing "url"');
      setSlidesUrl(data.url);
      window.open(data.url, 'slides-preview');
    } catch (e) {
      setError(
        e instanceof Error && e.message.startsWith('Backend')
          ? e.message
          : `Could not reach the slides service at ${apiBase}. Is it running?`,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.slidesBar}>
      {slidesUrl ? (
        <>
          <button
            type="button"
            className={`${styles.slidesBtn} ${styles.slidesBtnPrimary}`}
            onClick={() => window.open(slidesUrl, 'slides-preview')}
          >
            ▶ Present slides
          </button>
          <button
            type="button"
            className={styles.slidesBtn}
            onClick={generate}
            disabled={busy}
          >
            {busy ? '⏳ Regenerating…' : '↻ Regenerate'}
          </button>
        </>
      ) : (
        <button
          type="button"
          className={`${styles.slidesBtn} ${styles.slidesBtnPrimary}`}
          onClick={generate}
          disabled={busy}
        >
          {busy ? '⏳ Generating…' : '⚡ Create slides'}
        </button>
      )}
      {error && <span className={styles.slidesError}>{error}</span>}
    </div>
  );
}

export default function FooterWrapper(props: Props): React.ReactElement {
  return (
    <>
      <SlidesButton />
      <Footer {...props} />
    </>
  );
}
