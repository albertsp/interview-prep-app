"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white [background-image:linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:64px_64px]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
