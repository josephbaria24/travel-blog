"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mail, Loader2 } from "lucide-react"

export function FeedbackSection() {
  const { toast } = useToast()

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const response = await fetch("https://formspree.io/f/mzzjaazj", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "Your feedback has been sent successfully.",
        })
        setForm({ name: "", email: "", message: "" })
      } else {
        throw new Error("Failed to send feedback")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send feedback. Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="feedback" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
          <Mail className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">We'd Love Your Feedback</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
          Got thoughts, suggestions, or love letters? Share them with us. We read every message.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left max-w-xl mx-auto">
          <Input
            type="text"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Textarea
            name="message"
            placeholder="Your message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            disabled={loading}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Feedback"
            )}
          </Button>
        </form>

        {/* <p className="text-sm text-muted-foreground mt-4">
          Feedback goes to <span className="font-medium">josephbaria89@gmail.com</span>
        </p> */}
      </div>
    </section>
  )
}
