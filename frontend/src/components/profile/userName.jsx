"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { updateProfile } from "@/services/profileService"

export function ChangeUserName({isOpenChangeUserName, setIsOpenChangeUserName, profile, setProfile}) {
  const [newName, setNewName] = useState(profile?.name || "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const { updateUser } = useAuth()

  const handleSave = async () => {
    if (!newName.trim()) return
    setSaving(true)
    setError(null)
    try {
      const data = await updateProfile(newName.trim())
      setProfile({ ...profile, name: data.name })
      updateUser(data.name)
      setIsOpenChangeUserName(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpenChangeUserName} onOpenChange={setIsOpenChangeUserName}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Cambiar Nombre de Usuario</DialogTitle>
          <DialogDescription>
            Escribe tu nuevo nombre de usuario
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
        )}
        <div className="px-4 pb-2">
          <Input
            id="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre de usuario"
            className="mt-1"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={saving}>Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving || !newName.trim()}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}