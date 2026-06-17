import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupDemo({ setSearchInput, resultCount }) {
  return (
    <InputGroup className="w-full sm:max-w-xs">
      <InputGroupInput onChange={(e) => setSearchInput(e.target.value)} placeholder="Buscar..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{resultCount} resultados</InputGroupAddon>
    </InputGroup>
  )
}
