"use client";

import { cn } from "@/lib/utils";

// Separa el texto en bloques de codigo y texto normal detectando ```language ... ```
function parseMarkdownBlocks(text) {
  const blocks = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Texto normal antes del bloque de codigo
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    // Bloque de codigo
    blocks.push({
      type: "code",
      language: match[1] || "code",
      content: match[2].trimEnd(),
    });

    lastIndex = regex.lastIndex;
  }

  // Texto restante despues del ultimo bloque de codigo
  if (lastIndex < text.length) {
    blocks.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return blocks.length > 0 ? blocks : [{ type: "text", content: text }];
}

const LANG_LABELS = {
  javascript: "JS",
  js: "JS",
  jsx: "JSX",
  typescript: "TS",
  ts: "TS",
  tsx: "TSX",
  python: "PY",
  py: "PY",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  bash: "Bash",
  sh: "Bash",
  shell: "Shell",
  json: "JSON",
  yaml: "YAML",
  xml: "XML",
  code: "Code",
};

export default function MarkdownContent({ text, className }) {
  const blocks = parseMarkdownBlocks(text || "");

  return (
    <div className={cn("space-y-4", className)}>
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return <CodeSnippet key={idx} code={block.content} language={block.language} />;
        }
        // Texto normal: respetamos saltos de linea
        return (
          <p key={idx} className="whitespace-pre-wrap leading-relaxed">
            {block.content}
          </p>
        );
      })}
    </div>
  );
}

function CodeSnippet({ code, language }) {
  const label = LANG_LABELS[language.toLowerCase()] || language || "Code";

  return (
    <div className="rounded-xl overflow-hidden border bg-[#0d1117] shadow-sm">
      {/* Barra superior tipo terminal */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f56]" />
          <span className="size-3 rounded-full bg-[#ffbd2e]" />
          <span className="size-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="ml-3 text-[11px] font-medium tracking-wider text-white/40 uppercase">
          {label}
        </span>
      </div>
      {/* Contenido del codigo */}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono leading-relaxed text-[#c9d1d9] whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
