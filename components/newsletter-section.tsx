"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Newsletter signup:", email)
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
          <Mail className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Never Miss an Adventure</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
          Subscribe to our newsletter and get the latest travel stories, tips, and destination guides delivered straight
          to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-12 border-2"
          />
          <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12">
            Subscribe
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">Join 10,000+ travelers already subscribed</p>
      </div>
    </section>
  )
}
