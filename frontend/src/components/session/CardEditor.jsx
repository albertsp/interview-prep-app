"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CodeEditor from "@/components/CodeEditor";
import { Lightbulb, Code, AlignLeft } from "lucide-react";

// Renderiza un bloque de codigo con estilo terminal (reusando el patron de MarkdownContent)
function CodePreview({ code, language }) {
  if (!code) return null;

  const label = language || "Code";

  return (
    <div className="rounded-xl overflow-hidden border bg-[#0d1117] shadow-sm">
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
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono leading-relaxed text-[#c9d1d9] whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}

export default function CardEditor({ card, onChange }) {
  // Alterna entre textarea y editor CodeMirror para el campo de codigo
  const [isCodeEditorMode, setIsCodeEditorMode] = useState(true);

  // Actualiza un campo concreto de la card
  const updateField = (field, value) => {
    onChange({ ...card, [field]: value });
  };

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="size-5 text-primary" />
          Card de estudio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pb-6">
        {/* Concepto */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Concepto
          </Label>
          <Input
            value={card.concept || ""}
            onChange={(e) => updateField("concept", e.target.value)}
            placeholder="Nombre del concepto..."
            className="text-base font-medium"
          />
        </div>

        {/* Explicacion */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Explicacion
          </Label>
          <textarea
            value={card.explanation || ""}
            onChange={(e) => updateField("explanation", e.target.value)}
            rows={3}
            placeholder="Explicacion del concepto..."
            className={cn(
              "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y transition-colors outline-none",
              "placeholder:text-muted-foreground",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
          />
        </div>

        {/* Codigo */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Codigo
          </Label>

          {/* Toggle texto / codigo */}
          <div className="flex items-center justify-end gap-1 mb-2">
            <span className="text-xs text-muted-foreground mr-2">
              {isCodeEditorMode ? "Editor de codigo" : "Texto"}
            </span>
            <div className="flex rounded-lg border border-border bg-muted p-0.5">
              <button
                type="button"
                onClick={() => setIsCodeEditorMode(false)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  !isCodeEditorMode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <AlignLeft className="size-3.5" />
                Texto
              </button>
              <button
                type="button"
                onClick={() => setIsCodeEditorMode(true)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  isCodeEditorMode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Code className="size-3.5" />
                Codigo
              </button>
            </div>
          </div>

          {/* Editor de codigo o textarea */}
          {isCodeEditorMode ? (
            <CodeEditor
              value={card.code || ""}
              onChange={(value) => updateField("code", value)}
              placeholder="Pega tu snippet de codigo aqui..."
            />
          ) : (
            <textarea
              value={card.code || ""}
              onChange={(e) => updateField("code", e.target.value)}
              rows={4}
              placeholder="Pega tu snippet de codigo aqui..."
              className={cn(
                "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y transition-colors outline-none",
                "placeholder:text-muted-foreground",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              )}
            />
          )}

          {/* Vista previa del codigo con estilo terminal */}
          {card.code && (
            <div className="pt-2">
              <CodePreview
                code={card.code}
                language={card.code_language || "javascript"}
              />
            </div>
          )}
        </div>

        {/* Caso de uso */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Caso de uso
          </Label>
          <textarea
            value={card.use_case || ""}
            onChange={(e) => updateField("use_case", e.target.value)}
            rows={2}
            placeholder="Caso de uso practico..."
            className={cn(
              "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y transition-colors outline-none",
              "placeholder:text-muted-foreground",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
