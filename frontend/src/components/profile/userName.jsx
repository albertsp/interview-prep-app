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

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function ChangeUserName({isOpenChangeUserName, setIsOpenChangeUserName, token, profile, setProfile, updateUserName}) {
  const [newName, setNewName] = useState(profile?.name || "")

  const handleSave = async () => {
    if (!newName.trim()) return
    const response = await fetch(`${API_URL}/me/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newName.trim() })
    })
    if (response.ok) {
      const data = await response.json()
      setProfile({ ...profile, name: data.name })
      localStorage.setItem("user", data.name)
      updateUserName(data.name)
      setIsOpenChangeUserName(false)
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