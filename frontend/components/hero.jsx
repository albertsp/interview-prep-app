
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
    <section className="flex flex-col items-center justify-center px-6 py-40 text-center bg-white">

        <span className="inline-block mb-6 px-3 py-1 rounded-full border border-gray-200 text-gray-400 text-xs">
            ✦ AI-powered
        </span>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-3 max-w-lg">
        Prep your next tech interview
      </h1>

      <p className="text-gray-400 text-base max-w-sm mb-10 leading-relaxed">
        Configura tu entrevista personalizada en tres pasos
      </p>

      
      <div className="flex flex-wrap gap-3 justify-center mb-16">
        
        <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 rounded-2xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Nueva sesión
        </button>
      </div>

      
      <div className="flex gap-12 justify-center">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-400">{label}</span>
          </div>
        ))}
      </div>

    </section>
  );
}
