"use client";

import { motion } from "framer-motion";
import MarkdownContent from "@/components/MarkdownContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

export default function QuestionPhase({
  question,
  answer,
  error,
  onAnswerChange,
  onSubmit,
}) {
  return (
    <motion.div
      key="answering"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="mb-6">
        <CardContent className="p-8 md:p-10">
          <MarkdownContent text={question} className="text-xl leading-relaxed" />
        </CardContent>
      </Card>

      <textarea
        className={cn(
          "w-full min-h-[160px] rounded-xl border border-input bg-background px-5 py-4 text-base resize-y transition-colors outline-none",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        placeholder="Escribe tu respuesta aqui..."
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-destructive text-base mt-3"
        >
          {error}
        </motion.p>
      )}

      <div className="mt-6 flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!answer.trim()}
          size="lg"
          className="gap-2 px-10 text-base"
        >
          Enviar respuesta
          <Send className="size-5" />
        </Button>
      </div>
    </motion.div>
  );
}
