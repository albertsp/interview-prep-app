"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LevelHero from "@/components/stats/LevelHero";
import StatCards from "@/components/stats/StatCards";
import RecentSessions from "@/components/stats/RecentSessions";
import SavedCardsSummary from "@/components/stats/SavedCardsSummary";

const ResultsDonut = dynamic(() => import("@/components/stats/ResultsDonut"), { ssr: false });
const StackBars = dynamic(() => import("@/components/stats/StackBars"), { ssr: false });

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

  return (
    <div className="px-4 sm:px-6 pt-24 pb-10">
      <motion.div
        className="max-w-5xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <LevelHero
            level={stats.level}
            progressInLevel={stats.progress_in_level}
            xpPerLevel={stats.xp_per_level}
            xpToNextLevel={stats.xp_to_next_level}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCards stats={stats} sessionsCount={stats.sessions_count} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <ResultsDonut results={stats.results_summary} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StackBars stacks={stats.stacks_stats} />
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <RecentSessions sessions={stats.recent_sessions} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SavedCardsSummary
            total={stats.cards_summary.total}
            topTags={stats.cards_summary.top_tags}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}