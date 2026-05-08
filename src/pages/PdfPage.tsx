import { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { env } from '../lib/env';

export const PdfPage = () => {
  const hasPdf = Boolean(env.dashboardPdfUrl);
  const hasDoc = Boolean(env.dashboardDocUrl);
  const docContainerRef = useRef<HTMLDivElement | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasDoc || hasPdf) return;

    let isCancelled = false;

    const loadDoc = async () => {
      if (!docContainerRef.current) return;
      setDocLoading(true);
      setDocError(null);

      try {
        const response = await fetch(env.dashboardDocUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch document (${response.status})`);
        }
        const arrayBuffer = await response.arrayBuffer();
        if (isCancelled || !docContainerRef.current) return;

        docContainerRef.current.innerHTML = '';
        await renderAsync(arrayBuffer, docContainerRef.current, undefined, {
          inWrapper: false,
          ignoreWidth: true,
          ignoreHeight: true,
        });
      } catch (error) {
        if (isCancelled) return;
        const message = error instanceof Error ? error.message : 'Unable to render document.';
        setDocError(message);
      } finally {
        if (!isCancelled) setDocLoading(false);
      }
    };

    void loadDoc();

    return () => {
      isCancelled = true;
    };
  }, [hasDoc, hasPdf]);

  if (!hasPdf && !hasDoc) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        Set <code>VITE_DASHBOARD_PDF_URL</code> or <code>VITE_DASHBOARD_DOC_URL</code> in <code>.env</code> to display a document here.
      </div>
    );
  }

  if (hasPdf) {
    return (
      <div className="space-y-4">
        <div className="h-[72vh] overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <iframe title="Dashboard PDF" src={env.dashboardPdfUrl} className="h-full w-full" />
        </div>
        <a
          href={env.dashboardPdfUrl}
          download
          className="inline-flex rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white"
        >
          Download PDF
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[78vh] overflow-auto rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
        {docLoading && (
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading Word document...</p>
        )}
        {docError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Could not render document in page: {docError}
          </p>
        )}
        <div ref={docContainerRef} className="docx" />
        <style>{`
          .docx {
            width: 100%;
          }
          .docx section.docx {
            width: 100% !important;
            min-height: auto !important;
            box-sizing: border-box;
          }
        `}</style>
      </div>
      <a
        href={env.dashboardDocUrl}
        download
        className="inline-flex rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white"
      >
        Download Word File
      </a>
    </div>
  );
};
