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
export function DeleteCard({ isDeleteCardOpen, setIsDeleteCardOpen, deleteCard, selectedCard}) {
  return (
    <Dialog open={isDeleteCardOpen} onOpenChange={setIsDeleteCardOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Card Seleccionada</DialogTitle>
          <DialogDescription>
            Estas seguro que deseas borrar la card?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <DialogClose asChild>
              <Button 
                
              variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
            onClick={() => { 
              deleteCard(selectedCard.card_id)              
              setIsDeleteCardOpen(false)
            }}
            >
              Eliminar
              </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}