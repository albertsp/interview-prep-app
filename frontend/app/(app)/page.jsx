"use client";

import { Button } from "@/components/ui/button";
import CTA from "components/cta";
import Features from "components/features";
import Hero from "components/hero";
import HowItWorks from "components/howitworks";
import Techs from "components/techs";

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
