"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation";
import { DropdownMenuDemo } from "./Userdropdown";
import { useRef, useEffect } from "react";


export default function Navigation() {

  const router = useRouter();
  const logoutRef = useRef<HTMLButtonElement>(null);
  const getStartedRef = useRef<HTMLButtonElement>(null);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push('/')
  }

  const handleGetStarted = () => {
    if (localStorage.getItem("token")) {
      router.push('/dashboard')
    }
    else {
      router.push('/login')
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      if (logoutRef.current) {
        (logoutRef.current as HTMLButtonElement).style.display="none";
      }
    }

    if(localStorage.getItem("token")) {
      if (getStartedRef.current) {
        (getStartedRef.current as HTMLButtonElement).style.display="none";
      }
    }

    
  }, [logoutRef, getStartedRef])



  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold">Taskdrawer</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <ThemeToggle />
          <DropdownMenuDemo />


          <Button ref={logoutRef} onClick={() => handleLogout()}>
            Log out
          </Button>
          <Button ref={getStartedRef} onClick={() => handleGetStarted()}>
            Get Started
          </Button>


        </nav>
      </div>
    </header>
  )
}