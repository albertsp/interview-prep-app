import { Code2, X } from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function FilterButtons({ setLanguageFilter }) {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
      
      <ToggleGroup variant="outline" type="single" onValueChange={setLanguageFilter} className="flex-wrap">
        <ToggleGroupItem value="html" aria-label="Filtrar por HTML" className="text-xs">
          <Code2 className="size-3.5 mr-1.5" />
          HTML
        </ToggleGroupItem>
        <ToggleGroupItem value="javascript" aria-label="Filtrar por JavaScript" className="text-xs">
          <Code2 className="size-3.5 mr-1.5" />
          JS
        </ToggleGroupItem>
        <ToggleGroupItem value="python" aria-label="Filtrar por Python" className="text-xs">
          <Code2 className="size-3.5 mr-1.5" />
          PY
        </ToggleGroupItem>
        <ToggleGroupItem value="sql" aria-label="Filtrar por SQL" className="text-xs">
          <Code2 className="size-3.5 mr-1.5" />
          SQL
        </ToggleGroupItem>
        <ToggleGroupItem value="react" aria-label="Filtrar por React" className="text-xs">
          <Code2 className="size-3.5 mr-1.5" />
          REACT
        </ToggleGroupItem>
        <ToggleGroupItem value="" aria-label="Limpiar filtro" className="text-xs">
          <X className="size-3.5 mr-1.5" />
          Reset
        </ToggleGroupItem>
      </ToggleGroup>

    </div>
  )
}
