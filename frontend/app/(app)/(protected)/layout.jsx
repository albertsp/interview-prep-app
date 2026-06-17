"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout({ children }) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  // No redirigimos hasta que AuthContext haya verificado la sesion
  useEffect(() => {
    if (initialized && !user) router.replace("/");
  }, [initialized, user, router]);

  // Mientras se inicializa el contexto, no renderizamos nada
  if (!initialized) return null;
  // Si ya se inicializo y no hay usuario, redirigimos
  if (!user) return null;
  return <>{children}</>;
}
