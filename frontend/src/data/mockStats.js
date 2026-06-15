export const MOCK_STATS = {
  total_xp: 920,
  level: 3,
  xp_to_next_level: 180,
  progress_in_level: 320,
  xp_per_level: 500,

  results_summary: {
    correct: 12,
    partially_correct: 8,
    incorrect: 3,
  },

  stacks_stats: [
    { stack: "JavaScript", sessions: 5, cards: 18 },
    { stack: "React", sessions: 3, cards: 12 },
    { stack: "Python", sessions: 2, cards: 8 },
    { stack: "SQL", sessions: 1, cards: 3 },
  ],

  sessions_count: 7,

  recent_sessions: [
    {
      stack: "React",
      level: "Intermedio",
      created_at: "2026-06-12T10:30:00",
      total_questions: 5,
      correct: 4,
      partially_correct: 1,
      incorrect: 0,
    },
    {
      stack: "JavaScript",
      level: "Basico",
      created_at: "2026-06-10T15:45:00",
      total_questions: 5,
      correct: 3,
      partially_correct: 1,
      incorrect: 1,
    },
    {
      stack: "Python",
      level: "Avanzado",
      created_at: "2026-06-08T09:00:00",
      total_questions: 5,
      correct: 2,
      partially_correct: 2,
      incorrect: 1,
    },
    {
      stack: "SQL",
      level: "Intermedio",
      created_at: "2026-06-05T14:20:00",
      total_questions: 5,
      correct: 3,
      partially_correct: 2,
      incorrect: 0,
    },
    {
      stack: "JavaScript",
      level: "Avanzado",
      created_at: "2026-06-01T11:00:00",
      total_questions: 5,
      correct: 0,
      partially_correct: 2,
      incorrect: 3,
    },
  ],

  cards_summary: {
    total: 23,
    top_tags: ["react", "closures", "hooks", "async", "promises"],
  },
};

export const STACK_COLORS = {
  JavaScript: { bg: "bg-yellow-500/10", text: "text-yellow-700", ring: "ring-yellow-500/30", bar: "#f7df1e" },
  React: { bg: "bg-cyan-500/10", text: "text-cyan-700", ring: "ring-cyan-500/30", bar: "#61dafb" },
  Python: { bg: "bg-emerald-500/10", text: "text-emerald-700", ring: "ring-emerald-500/30", bar: "#3776ab" },
  SQL: { bg: "bg-violet-500/10", text: "text-violet-700", ring: "ring-violet-500/30", bar: "#336791" },
  "HTML/CSS": { bg: "bg-orange-500/10", text: "text-orange-700", ring: "ring-orange-500/30", bar: "#e34f26" },
};

export const LEVEL_BADGES = {
  Basico: "bg-green-500/10 text-green-700 border-green-500/30",
  "Básico": "bg-green-500/10 text-green-700 border-green-500/30",
  Intermedio: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  Avanzado: "bg-red-500/10 text-red-700 border-red-500/30",
};