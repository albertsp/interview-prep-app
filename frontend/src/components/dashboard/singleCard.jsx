import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DeleteCard } from "@/components/dashboard/delete";
import { ConfirmEdit } from "@/components/dashboard/confirmEdit";
import { useState } from "react"
import CardEditor from "@/components/session/CardEditor"
import { Lightbulb, Save } from "lucide-react"

export function SingleCard({ isSingleCardOpen, setIsSingleCardOpen, selectedCard, originalCard, onCardChange, onSave, deleteCard }) {

  const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const abrirDelete = () => {
    setIsDeleteCardOpen(true)
  }

  return (

    <Dialog open={isSingleCardOpen} onOpenChange={setIsSingleCardOpen}>
      <DeleteCard isDeleteCardOpen={isDeleteCardOpen} setIsDeleteCardOpen={setIsDeleteCardOpen} deleteCard={deleteCard} selectedCard={selectedCard} />
      <ConfirmEdit isConfirmOpen={isConfirmOpen} setIsConfirmOpen={setIsConfirmOpen} onSave={onSave} />
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="size-5 text-primary" />
            Card de estudio
          </DialogTitle>
          <DialogDescription>
            Revisa y edita los detalles de tu card de estudio
          </DialogDescription>
        </DialogHeader>

        {selectedCard && (
          <>
            <CardEditor card={selectedCard} onChange={onCardChange} originalCard={originalCard} />
            <DialogFooter className="gap-2">
              <Button
                variant="destructive"
                className="text-xs font-medium px-3 py-1.5 h-auto bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-none"
                onClick={() => { abrirDelete() }}>
                Eliminar
              </Button>
              <Button
                onClick={() => setIsConfirmOpen(true)}
                size="lg"
                className="gap-2"
              >
                <Save className="size-4" />
                Guardar cambios
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>

    </Dialog>
  )
}


