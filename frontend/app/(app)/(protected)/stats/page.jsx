"use client";

import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Configuracion central de las 3 stat cards: icono, color, label y como
// derivar el valor numerico desde el objeto `stats`. Mantenerlo como data
// (no como JSX) permite reordenar o anadir cards en un solo lugar.
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
    // toLocaleString formatea con separador de miles segun idioma (1.250)
    value: (s) => s.total_xp.toLocaleString("es-ES"),
  },
  {
    key: "xp_to_next",
    label: "Al siguiente nivel",
    icon: TrendingUp,
    iconClass: "text-emerald-500",
    value: (s) => s.xp_to_next_level.toLocaleString("es-ES"),
  },
];

// Variants reutilizables: el contenedor orquesta la cascada y los hijos
// comparten las mismas keys ("hidden" / "visible") para entrar escalonados
// sin necesidad de pasar delays manuales a cada uno.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function StatsPage() {
  const { stats } = useAuth();

  // Progreso hacia el siguiente nivel en porcentaje (0-100).
  // La guardia evita division por cero si xp_per_level viniera vacio.
  const progressPct =
    stats.xp_per_level > 0
      ? Math.min(100, (stats.progress_in_level / stats.xp_per_level) * 100)
      : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HERO: nivel grande + barra de progreso al siguiente nivel.
            El borde y fondo ambar conectan visualmente con el badge XP del navbar. */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 overflow-hidden">
            <CardContent className="p-8 md:p-10 flex flex-col items-center text-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                Tu nivel actual
              </span>

              {/* Numero grande con texto-gradiente: truco CSS para colorear
                  solo el contorno del texto, no el fondo */}
              <div className="text-7xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {stats.level}
              </div>
              <span className="text-sm text-muted-foreground mt-1">Nivel</span>

              {/* Barra de progreso: animamos width de 0 al valor real
                  para que "se rellene" al cargar la pagina */}
              <div className="w-full max-w-md mt-6">
                <div className="h-3 w-full rounded-full bg-amber-500/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                  <span>
                    {stats.progress_in_level} / {stats.xp_per_level} XP
                  </span>
                  <span>
                    {stats.xp_to_next_level} XP al Nv {stats.level + 1}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* GRID: 3 stat cards. Stagger heredado del contenedor + hover sutil
            via whileHover (scale + lift) usando spring para feeling natural. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                    <Icon className={cn("size-6", card.iconClass)} />
                    <span className="text-3xl font-bold tracking-tight">
                      {card.value(stats)}
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

        {/* TEASER: roadmap de fases 1-3. El borde punteado indica
            "contenido en construccion" sin parecer roto. */}
        <motion.div variants={itemVariants}>
          <Card className="border-dashed">
            <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-3">
              <Sparkles className="size-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">Próximamente</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Estamos preparando más estadísticas para ti:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Distribución por stack (JavaScript, Python, ...)</li>
                <li>Tendencia temporal de XP</li>
                <li>Sesiones completadas y cards guardadas</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
