"use client";

import Link from "next/link";
import { useRouter} from "next/navigation"

const STATS = [
  { value: "120+", label: "Preguntas" },
  { value: "7", label: "Categorías" },
  { value: "3", label: "Niveles" },
];

export default function Hero() {

  const router = useRouter()

  return (
    <section className="flex flex-col items-center justify-center px-6 py-44 text-center bg-white">

        <span className="inline-block mb-8 px-4 py-1.5 rounded-full border border-gray-200 text-gray-400 text-sm">
            ✦ Potenciado por IA
        </span>

      <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-4 max-w-xl">
        Prepárate para tu próxima entrevista técnica
      </h1>

      <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
        Configura tu entrevista personalizada en tres pasos
      </p>


      <div className="flex flex-wrap gap-3 justify-center mb-16">

        <button
          onClick={() => router.push("/register")}
          className="px-8 py-3.5 rounded-2xl bg-gray-900 text-white text-base font-medium hover:bg-gray-700 transition-colors"
        >
          Nueva sesión
        </button>
      </div>


      <div className="flex gap-12 justify-center">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-base text-gray-400">{label}</span>
          </div>
        ))}
      </div>

    </section>
  );
}
