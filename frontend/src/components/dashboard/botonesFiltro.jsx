import { Code2, X, ArrowUpAZ, ArrowDownZA } from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// Añadimos setOrderSort a las props para que controle el ordenamiento
export function ToggleGroupDemo({ setLanguageFilter, setOrderSort }) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      
      {/* Grupo de Filtro de Lenguaje */}
      <ToggleGroup variant="outline" type="single" onValueChange={setLanguageFilter}>
        <ToggleGroupItem value="html" aria-label="Filtrar por HTML">
          <Code2 className="size-4 mr-2" />
          HTML
        </ToggleGroupItem>
        <ToggleGroupItem value="javascript" aria-label="Filtrar por JavaScript">
          <Code2 className="size-4 mr-2" />
          JAVASCRIPT
        </ToggleGroupItem>
        <ToggleGroupItem value="python" aria-label="Filtrar por Python">
          <Code2 className="size-4 mr-2" />
          PYTHON
        </ToggleGroupItem>
        <ToggleGroupItem value="sql" aria-label="Filtrar por SQL">
          <Code2 className="size-4 mr-2" />
          SQL
        </ToggleGroupItem>
        <ToggleGroupItem value="react" aria-label="Filtrar por React">
          <Code2 className="size-4 mr-2" />
          REACT
        </ToggleGroupItem>
        <ToggleGroupItem value="" aria-label="Limpiar filtro">
          <X className="size-4 mr-2" />
          Reset
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Nuevo Grupo de Ordenamiento */}
      <ToggleGroup variant="outline" type="single" defaultValue="desc" onValueChange={setOrderSort}>
        <ToggleGroupItem value="asc" aria-label="Ordenar de más antiguo a más reciente">
          <ArrowUpAZ className="size-4 mr-2" />          
        </ToggleGroupItem>
        <ToggleGroupItem value="desc" aria-label="Ordenar de más reciente a más antiguo">
          <ArrowDownZA className="size-4 mr-2" />
          
        </ToggleGroupItem>
      </ToggleGroup>

    </div>
  )
}
