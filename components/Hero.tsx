"use client";

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Hero() {

  const router = useRouter()

  const handleStartButton = () => {
    if(localStorage.getItem("token")) {
      router.push('/dashboard')
    }
    else{
      router.push('/login')
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
          Transform Your Workflow
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Streamline your process, boost productivity, and achieve more with our comprehensive solution.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={handleStartButton} size="lg" className="px-8">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}