
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function DropdownMenuDemo() {


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Profile</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Hello {localStorage.getItem("username") && localStorage.getItem("username")}</DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
