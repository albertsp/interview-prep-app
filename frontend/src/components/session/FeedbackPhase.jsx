"use client";

import { motion } from "framer-motion";
import MarkdownContent from "@/components/MarkdownContent";
import CardEditor from "@/components/session/CardEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Save, Sparkles } from "lucide-react";

export default function FeedbackPhase({
  feedback,
  card,
  onCardChange,
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
      {/* Seccion de feedback de la IA */}
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

      {/* Card de estudio editable inline */}
      {card && <CardEditor card={card} onChange={onCardChange} />}

      {/* Botones de accion: descartar o guardar */}
      <div className="flex justify-end gap-2">
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
