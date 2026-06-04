"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout({ children }) {
  const { token, initialized } = useAuth();
  const router = useRouter();

  // No redirigimos hasta que AuthContext haya leido localStorage
  useEffect(() => {
    if (initialized && !token) router.replace("/");
  }, [initialized, token, router]);

  // Mientras se inicializa el contexto, no renderizamos nada
  if (!initialized) return null;
  // Si ya se inicializo y no hay token, redirigimos
  if (!token) return null;
  return <>{children}</>;
}
