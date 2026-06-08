"use client";

import { Button } from "@/components/ui/button";
import CTA from "@/components/home/cta";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/howitworks";
import Techs from "@/components/home/techs";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Hero />
      <Techs />
      <HowItWorks />
      <Features />
      <CTA/>
    </div>
    
  )
}
