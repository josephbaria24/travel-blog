import { AdminProvider } from "@/contexts/admin-context"
import { GlassNavbar } from "@/components/glass-navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturedDestinations } from "@/components/featured-destinations"
import { TravelStories } from "@/components/travel-stories"
import { TravelGuides } from "@/components/travel-guides"
import { FeedbackSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <AdminProvider>
      <main className="min-h-screen">
        <GlassNavbar />
        <HeroSection />
        <FeaturedDestinations />
        <TravelStories />
        <TravelGuides />
        <FeedbackSection />
        <Footer />
      </main>
    </AdminProvider>
  )
}