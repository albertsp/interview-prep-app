"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, RotateCcw } from "lucide-react";

export default function SessionComplete({
  totalQuestions,
  stack,
  onDashboard,
  onNewSession,
}) {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-8 md:p-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="mb-6 size-20 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <CheckCircle className="size-10 text-primary" />
          </motion.div>

          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Sesion completada
          </h2>
          <p className="text-base text-muted-foreground mb-2">
            Has completado las {totalQuestions} preguntas de{" "}
            <span className="font-medium text-foreground">{stack}</span>.
          </p>
          <p className="text-base text-muted-foreground mb-8">
            Revisa las cards guardadas en tu dashboard para repasar los conceptos
            clave.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={onDashboard}
              className="gap-2"
            >
              <Home className="size-5" />
              Ir al dashboard
            </Button>
            <Button
              size="lg"
              onClick={onNewSession}
              className="gap-2"
            >
              <RotateCcw className="size-5" />
              Nueva sesion
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
