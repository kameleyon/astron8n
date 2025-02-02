"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="md:hidden relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed top-[3.5rem] left-0 right-0 bg-primary shadow-lg border-t border-white/10">
          <div className="bg-[#0d0630] backdrop-blur-sm py-4 px-6 space-y-4 mobile-menu">
            <a href="/about" className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors">About</a>
            <a href="/features" className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors">Features</a>
            <a href="/features#pricing" className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors">Prices</a>
            <a href="#api" className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors">API</a>
          </div>
        </div>
      )}
    </div>
  );
}