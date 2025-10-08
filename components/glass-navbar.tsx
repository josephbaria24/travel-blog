"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Compass, MapPin, BookOpen, Info, FileText } from "lucide-react"

export function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#destinations", label: "Destinations", icon: MapPin },
    { href: "#stories", label: "Stories", icon: FileText },
    { href: "#guides", label: "Guides", icon: BookOpen },
    { href: "#about", label: "About", icon: Info },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-lg border-b border-gray-200/60 shadow-sm"
          : "bg-white/50 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-slate-900 rounded-lg p-2 group-hover:bg-slate-800 transition-colors shadow-sm">
              <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
              Travel Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 rounded-lg transition-all font-medium text-sm"
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100/60 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" strokeWidth={2} />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/60 bg-white/40 backdrop-blur-sm">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 transition-all font-medium px-3 py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}