"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-0 ring-1 ring-foreground/10 shadow-sm">
          <CardContent className="p-8 md:p-10 flex flex-col items-center text-center gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">
                Stats
              </h1>
              <p className="text-sm text-muted-foreground">
                Proximamente podras ver aqui tus estadisticas detalladas:
                XP, racha, progreso por stack y mas.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
