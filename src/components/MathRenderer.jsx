import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const KATEX_OPTIONS = {
  throwOnError: false,
  strict: false,
  trust: false,
};

function MathRenderer({ value = "", className = "" }) {
  const [renderError, setRenderError] = useState(false);

  if (!value || (typeof value === "string" && !value.trim())) {
    return null;
  }

  try {
    return (
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, KATEX_OPTIONS]]}>
          {String(value)}
        </ReactMarkdown>
      </div>
    );
  } catch (err) {
    // fallback: show plain text
    setRenderError(true);
  }

  if (renderError) {
    return (
      <pre className={`rounded-xl bg-white px-3 py-2 font-mono text-sm text-slate-700 ${className}`}>{String(value)}</pre>
    );
  }

  return null;
}

export default MathRenderer;
