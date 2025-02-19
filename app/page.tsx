"use client";

import Navigation from "@/components/Navigation"
import Hero from '@/components/Hero'
import Features from "@/components/Features"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"
import { useEffect } from "react";

export default function Home() {


  useEffect(() => {
    document.title = "Taskdrawer : Your Personal Task Management Platform"
  }, [])
  

  return (
    <main className="min-h-screen bg-white">
       <Navigation />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}