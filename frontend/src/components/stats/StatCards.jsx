"use client";

import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STAT_CARDS = [
  {
    key: "level",
    label: "Tu nivel",
    icon: Trophy,
    iconClass: "text-amber-500",
    value: (s) => s.level,
  },
  {
    key: "total_xp",
    label: "XP total",
    icon: Star,
    iconClass: "text-amber-500 fill-amber-500",
    value: (s) => s.total_xp.toLocaleString("es-ES"),
  },
  {
    key: "xp_to_next",
    label: "Al siguiente nivel",
    icon: TrendingUp,
    iconClass: "text-emerald-500",
    value: (s) => s.xp_to_next_level.toLocaleString("es-ES"),
  },
  {
    key: "sessions",
    label: "Sesiones completadas",
    icon: Target,
    iconClass: "text-blue-500",
    value: (s) => s.sessions_count,
  },
];

export default function StatCards({ stats, sessionsCount }) {
  const extendedStats = { ...stats, sessions_count: sessionsCount };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                <Icon className={cn("size-6", card.iconClass)} />
                <span className="text-3xl font-bold tracking-tight">
                  {card.value(extendedStats)}
                </span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {card.label}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}