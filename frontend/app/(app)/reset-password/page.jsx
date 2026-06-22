"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { createResetToken, resetPassword } from "@/services/passwordResetService";
import { KeyRound, Mail, Lock, ArrowRight, Send, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRequestToken(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("El email es obligatorio");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("El formato del email no es valido");
      return;
    }

    setLoading(true);

    try {
      await createResetToken(email);
      setSuccess("Codigo enviado a tu correo. Revisa tu bandeja de entrada.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError("El codigo de recuperacion es obligatorio");
      return;
    }
    if (!password) {
      setError("La nueva contrasena es obligatoria");
      return;
    }
    if (password.length < 8) {
      setError("La contrasena debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token.trim(), password);
      router.push("/login?reset=success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-0 ring-1 ring-foreground/10 shadow-sm">
          {step === 1 && (
            <>
              <CardHeader className="space-y-1 pb-6 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                  <KeyRound className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Recuperar contrasena
                </CardTitle>
                <CardDescription>
                  Te enviaremos un codigo de recuperacion a tu email
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleRequestToken} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  {success && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 rounded-lg px-3 py-2"
                    >
                      {success}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full gap-2 text-base"
                  >
                    {loading ? "Enviando codigo..." : "Enviar codigo"}
                    {!loading && <Send className="size-5" />}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  <Link
                    href="/login"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Volver a iniciar sesion
                  </Link>
                </p>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="space-y-1 pb-6 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                  <ShieldCheck className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Restablecer contrasena
                </CardTitle>
                <CardDescription>
                  Ingresa el codigo que recibiste y tu nueva contrasena
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reset-token">Codigo de recuperacion</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="reset-token"
                        type="text"
                        placeholder="Ingresa el codigo"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reset-password">Nueva contrasena</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="reset-password"
                        type="password"
                        placeholder="Minimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reset-confirm">Confirmar contrasena</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="reset-confirm"
                        type="password"
                        placeholder="Repite la contrasena"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full gap-2 text-base"
                  >
                    {loading ? "Restableciendo..." : "Restablecer contrasena"}
                    {!loading && <ArrowRight className="size-5" />}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  <button
                    onClick={() => { setStep(1); setError(null); setSuccess(null); }}
                    className="font-medium text-primary underline-offset-2 hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Reenviar codigo
                  </button>
                </p>

                <p className="mt-2 text-center text-sm text-muted-foreground">
                  <Link
                    href="/login"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Volver a iniciar sesion
                  </Link>
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
