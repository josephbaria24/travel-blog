import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Panoramic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/stunning-panoramic-mountain-landscape-at-sunset-wi.jpg"
          alt="Panoramic travel destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Explore the World</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-balance">
          <span className="p-2 bg-primary from-primary via-secondary to-accent bg-clip-text text-transparent font-['HomemadeApple']">
            Adventures
          </span>{" "}
          <span className="text-foreground">Await Around Every Corner</span>
        </h1>



        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
          Join us on a journey through breathtaking landscapes, vibrant cultures, and unforgettable experiences from
          around the globe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
            Start Exploring
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <a href="#stories" className="hover:text-primary transition-colors">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-foreground/20 hover:border-primary hover:text-white bg-transparent cursor-pointer hover:bg-primary"
          >
            
                View Stories
              
          </Button>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  )
}
