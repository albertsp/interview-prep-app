import { ArrowUpAZ, ArrowDownZA } from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function SortOrder({ setOrderSort }) {
  return (
    <ToggleGroup variant="outline" type="single" defaultValue="desc" onValueChange={setOrderSort}>
      <ToggleGroupItem value="asc" aria-label="Ordenar de más antiguo a más reciente">
        <ArrowUpAZ className="size-4 mr-1.5" />          
      </ToggleGroupItem>
      <ToggleGroupItem value="desc" aria-label="Ordenar de más reciente a más antiguo">
        <ArrowDownZA className="size-4 mr-1.5" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
