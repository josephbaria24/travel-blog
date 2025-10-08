import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar } from "lucide-react"

const destinations = [
  {
    id: 1,
    title: "Santorini, Greece",
    description: "White-washed buildings and stunning sunsets over the Aegean Sea",
    image: "/santorini-greece-white-buildings-blue-domes-panora.jpg",
    location: "Greece",
    date: "March 2024",
  },
  {
    id: 2,
    title: "Kyoto, Japan",
    description: "Ancient temples, bamboo forests, and traditional tea ceremonies",
    image: "/kyoto-japan-bamboo-forest-temple-panoramic.jpg",
    location: "Japan",
    date: "April 2024",
  },
  {
    id: 3,
    title: "Patagonia, Argentina",
    description: "Dramatic mountains, glaciers, and pristine wilderness",
    image: "/patagonia-argentina-mountains-glaciers-panoramic-l.jpg",
    location: "Argentina",
    date: "February 2024",
  },
]

export function FeaturedDestinations() {
  return (
    <section id="destinations" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Featured <span className="text-primary">Destinations</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Discover the most breathtaking places we've explored recently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className="group overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">{destination.title}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">{destination.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-primary">
                    <MapPin className="w-4 h-4" />
                    <span>{destination.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{destination.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
