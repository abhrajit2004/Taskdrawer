"use client";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react";


export function DropdownMenuDemo() {

    const [username, setUsername] = useState("");

    useEffect(() => {
      if(localStorage.getItem("username")) {
       const username = JSON.stringify(localStorage.getItem("username"));
       setUsername(username);
      }
    }, [])
    


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Profile</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Hello {username}</DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
