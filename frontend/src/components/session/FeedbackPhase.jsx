"use client";

import { motion } from "framer-motion";
import MarkdownContent from "@/components/MarkdownContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Save, Sparkles, Lightbulb } from "lucide-react";

export default function FeedbackPhase({
  feedback,
  card,
  onEdit,
  onDiscard,
  onSave,
}) {
  return (
    <motion.div
      key="waiting_action"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-5 text-primary" />
            Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <MarkdownContent
            text={feedback}
            className="text-base text-muted-foreground"
          />
        </CardContent>
      </Card>

      {card && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="size-5 text-primary" />
                Card de estudio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pb-6">
              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Concepto
                </span>
                <p className="text-base font-medium mt-1">{card.concept}</p>
              </div>

              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Explicacion
                </span>
                <p className="text-base text-muted-foreground mt-1 leading-relaxed">
                  {card.explanation}
                </p>
              </div>

              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Caso de uso
                </span>
                <p className="text-base text-muted-foreground mt-1 leading-relaxed">
                  {card.use_case}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="lg"
          onClick={onEdit}
          className="gap-2"
        >
          <Pencil className="size-5" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onDiscard}
          className="gap-2"
        >
          <Trash2 className="size-5" />
          Descartar
        </Button>
        <Button onClick={onSave} size="lg" className="gap-2">
          <Save className="size-5" />
          Guardar card
        </Button>
      </div>
    </motion.div>
  );
}
