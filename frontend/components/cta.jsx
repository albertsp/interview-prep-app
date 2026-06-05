import Link from "next/link";
import { useRouter} from "next/navigation"

export default function CTA() {

    const router = useRouter()

    return (
    <section className="w-full px-6 py-24 bg-white flex flex-col items-center text-center">
 
      <h2 className="text-3xl font-bold text-gray-900 mb-3 max-w-sm">
        ¿Listo para tu próxima entrevista?
      </h2>
 
      <p className="text-gray-400 text-base max-w-xs mb-10 leading-relaxed">
        Configurá tu sesión en segundos y empezá a practicar ahora.
      </p>
     
      <button
        onClick={() => router.push("/register")}
        className="px-8 py-3 rounded-2xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Nueva sesión
      </button>
 
    </section>
  );
}
 