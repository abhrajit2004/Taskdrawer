"use client";

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 bg-blue-600 dark:bg-blue-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of satisfied users who have transformed their workflow
        </p>
        <Button size="lg" variant="secondary" className="px-8">
          Start Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}