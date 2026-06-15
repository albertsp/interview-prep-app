import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupDemo( {setSearchInput}) {
  return (
    <InputGroup className="w-full sm:max-w-xs">
      <InputGroupInput onChange={(e) => setSearchInput(e.target.value)} placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
    </InputGroup>
  )
}
