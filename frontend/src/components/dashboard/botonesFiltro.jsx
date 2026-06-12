import { Code2, X } from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function ToggleGroupDemo( {setLanguageFilter}) {
  return (
    <ToggleGroup variant="outline" type="single" onValueChange={setLanguageFilter}>
      <ToggleGroupItem value="html" aria-label="Toggle bold" >
        <Code2 className="size-4" />
        HTML
      </ToggleGroupItem>
      <ToggleGroupItem value="javascript" aria-label="Toggle italic">
        <Code2 className="size-4" />
        JAVASCRIPT
      </ToggleGroupItem>
      <ToggleGroupItem value="python" aria-label="Toggle strikethrough">
        <Code2 className="size-4" />
        PYTHON
      </ToggleGroupItem>
      <ToggleGroupItem value="sql" aria-label="Toggle bold">
        <Code2 className="size-4" />
        SQL
      </ToggleGroupItem>
      <ToggleGroupItem value="react" aria-label="Toggle italic">
        <Code2 className="size-4" />
        REACT
      </ToggleGroupItem>
      <ToggleGroupItem value="" aria-label="Toggle strikethrough">
        <X className="size-4" />
        Reset
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
