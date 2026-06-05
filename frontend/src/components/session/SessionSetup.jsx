"use client";

import { motion } from "framer-motion";
import StackSelector from "@/components/StackSelector";

export default function SessionSetup({ loading, error, onSubmit }) {
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <svg
              className="animate-spin h-10 w-10 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-muted-foreground text-xl">Creando sesion...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Nueva sesion</h1>
          <p className="text-muted-foreground mt-1">
            Configura tu entrevista personalizada en tres pasos
          </p>
        </div>
        <StackSelector onSubmit={onSubmit} />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-center mt-8"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}
