"use client";

import { useEffect, useRef } from "react";
import { EditorView, keymap, placeholder as placeholderExt } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { closeBrackets } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";

export default function CodeEditor({ value, onChange, placeholder = "" }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  // Crea el editor de CodeMirror al montar el componente
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const content = update.state.doc.toString();
        onChange(content);
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        // Soporte para JavaScript/TypeScript y Python
        javascript(),
        python(),
        // Cierre automatico de parentesis, corchetes y llaves
        closeBrackets(),
        // Keybindings por defecto + tab para indentar
        keymap.of([...defaultKeymap, indentWithTab]),
        // Tema oscuro para integrar con la app
        oneDark,
        // Placeholder en el editor
        placeholderExt(placeholder),
        // Listener para notificar cambios al padre
        updateListener,
        // Estilo visual del editor
        EditorView.theme({
          "&": {
            borderRadius: "var(--radius-xl, 0.75rem)",
            border: "1px solid var(--border)",
            fontSize: "0.875rem",
          },
          "&.cm-focused": {
            outline: "none",
            borderColor: "var(--ring)",
            boxShadow: "0 0 0 3px hsl(var(--ring) / 0.5)",
          },
          ".cm-scroller": {
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            lineHeight: "1.6",
          },
          ".cm-content": {
            padding: "0.75rem 1rem",
            minHeight: "200px",
          },
          ".cm-gutters": {
            display: "none",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  // Sincroniza el valor cuando cambia desde fuera (ej. al cargar una respuesta guardada)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentContent = view.state.doc.toString();
    if (value !== currentContent) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return <div ref={editorRef} className="w-full" />;
}
