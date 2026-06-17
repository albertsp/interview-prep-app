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
import { API_URL, handleResponse } from "@/services/httpClient"
import { useAuth } from "@/context/AuthContext"

export function ChangeUserName({isOpenChangeUserName, setIsOpenChangeUserName, profile, setProfile}) {
  const [newName, setNewName] = useState(profile?.name || "")

  const { updateUser } = useAuth()

  const handleSave = async () => {
    if (!newName.trim()) return
    try {
        const data = await handleResponse(
            await fetch(`${API_URL}/me/profile`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName.trim() })
            })
        )
        setProfile({ ...profile, name: data.name })
        updateUser(data.name)
        setIsOpenChangeUserName(false)
    } catch {
        // Error handled by handleResponse
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
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}