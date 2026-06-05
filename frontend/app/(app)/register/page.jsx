"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { registerUser } from "@/services/authService";

export default function RegisterPage() {
  // Estados locales para el formulario de registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Envia los datos de registro al backend y redirige al login
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerUser(name, email, password);
      router.push("/login");
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
          <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
          <Input
            id="fieldgroup-name"
            type="text"
            placeholder="Introduce tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

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
            {loading ? "Creando cuenta..." : "Submit"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
