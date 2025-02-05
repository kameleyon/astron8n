"use client"

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full text-white/80 py-3 px-6 text-sm border-t border-white/70 bg-primary/20 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <p>2025. Copyright AstroGenie</p>
        <Link 
          href="/test" 
          className="hover:text-white transition-colors"
        >
          Test
        </Link>
      </div>
    </footer>
  );
}
