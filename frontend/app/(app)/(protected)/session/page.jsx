"use client";

import StackSelector from "@/components/StackSelector";

export default function SessionPage() {
  const handleSubmit = (select) => {
    console.log(select);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Nueva sesión</h1>
          <p className="text-muted-foreground mt-1">
            Configura tu entrevista personalizada en tres pasos
          </p>
        </div>
        <StackSelector onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
