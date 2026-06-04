"use client";

import { useState } from "react";
import StackSelector from "@/components/StackSelector";
import { useAuth } from "@/context/AuthContext";

export default function SessionPage() {
  // Estado que guarda los datos de la sesion activa (null = modo seleccion)
  const [sessionData, setSessionData] = useState(null);
  // Estado para controlar el loading mientras se crea la sesion
  const [loading, setLoading] = useState(false);
  // Estado para mostrar errores al usuario
  const [error, setError] = useState(null);
  // Obtenemos el token JWT del contexto de autenticacion
  const { token } = useAuth();

  // Cuando el usuario completa el StackSelector, creamos la sesion en el backend
  const handleSubmit = async (select) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stack: select.stack,
            level: select.level,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Error || data.msg || "Error al crear la sesion");
      }

      // Guardamos la respuesta del backend con session_id, stack, level y questions
      setSessionData(data);
    } catch (error) {
      // Mostramos el error en pantalla para diagnosticar el problema
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mientras se crea la sesion, mostramos un estado de carga
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Creando sesion...</p>
      </div>
    );
  }

  // Si ya tenemos datos de sesion, mostramos el placeholder del modo sesion
  if (sessionData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Sesion activa</p>
      </div>
    );
  }

  // Modo seleccion: mostramos el StackSelector para configurar la sesion
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
        {error && (
          <p className="text-destructive text-center mt-8">{error}</p>
        )}
      </div>
    </div>
  );
}
