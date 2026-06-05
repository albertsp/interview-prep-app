"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  // Estados locales para el formulario de login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Envia las credenciales al backend y guarda la sesion en el contexto de auth
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginUser(email, password);
      login(result.name, result.access_token);
      router.push("/session");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
          <Input
            id="fieldgroup-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
          <Input
            id="fieldgroup-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        <Field orientation="horizontal">
          <Button type="submit" disabled={loading}>
            {loading ? "Iniciando sesion..." : "Submit"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
