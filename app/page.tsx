"use client";

import Navigation from "@/components/Navigation"
import Hero from '@/components/Hero'
import Features from "@/components/Features"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"

export default function Home() {


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