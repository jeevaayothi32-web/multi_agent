'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e5e5e5] bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-[#171717]">
                AI Multi-Agent <span className="text-[#3b82f6] font-medium">Innovation Analyzer</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#f3f4f6] text-[#6b7280] border border-[#e5e5e5]">
              Phase-2 Academic MVP
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-[#171717] ${
                pathname === '/' ? 'text-[#171717]' : 'text-[#6b7280]'
              }`}
            >
              Analyze Idea
            </Link>
            <Link
              href="/history"
              className={`text-sm font-medium transition-colors hover:text-[#171717] ${
                pathname === '/history' ? 'text-[#171717]' : 'text-[#6b7280]'
              }`}
            >
              Analysis History
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
