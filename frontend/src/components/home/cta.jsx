"use client";

import Link from "next/link";
import { useRouter} from "next/navigation"

export default function CTA() {

    const router = useRouter()

    return (
    <section className="w-full px-6 py-28 bg-white flex flex-col items-center text-center">

      <h2 className="text-4xl font-bold text-gray-900 mb-4 max-w-md">
        ¿Listo para tu próxima entrevista?
      </h2>

      <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
        Configura tu sesión en segundos y empieza a practicar ahora.
      </p>

      <button
        onClick={() => router.push("/register")}
        className="px-10 py-4 rounded-2xl bg-gray-900 text-white text-base font-medium hover:bg-gray-700 transition-colors"
      >
        Nueva sesión
      </button>

    </section>
  );
}
