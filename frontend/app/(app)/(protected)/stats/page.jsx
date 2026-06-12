"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { MOCK_STATS } from "@/data/mockStats";
import LevelHero from "@/components/stats/LevelHero";
import StatCards from "@/components/stats/StatCards";
import ResultsDonut from "@/components/stats/ResultsDonut";
import StackBars from "@/components/stats/StackBars";
import RecentSessions from "@/components/stats/RecentSessions";
import SavedCardsSummary from "@/components/stats/SavedCardsSummary";

const USE_MOCK = true;

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

  const data = USE_MOCK
    ? { ...stats, ...MOCK_STATS }
    : {
        ...stats,
        results_summary: { correct: 0, partially_correct: 0, incorrect: 0 },
        stacks_stats: [],
        sessions_count: 0,
        recent_sessions: [],
        cards_summary: { total: 0, top_tags: [] },
      };

  return (
    <div className="px-4 sm:px-6 py-10">
      <motion.div
        className="max-w-5xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <LevelHero
            level={data.level}
            progressInLevel={data.progress_in_level}
            xpPerLevel={data.xp_per_level}
            xpToNextLevel={data.xp_to_next_level}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCards stats={stats} sessionsCount={data.sessions_count} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <ResultsDonut results={data.results_summary} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StackBars stacks={data.stacks_stats} />
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <RecentSessions sessions={data.recent_sessions} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SavedCardsSummary
            total={data.cards_summary.total}
            topTags={data.cards_summary.top_tags}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}