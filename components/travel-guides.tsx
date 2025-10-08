import { Card, CardContent } from "@/components/ui/card"
import { Book, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const guides = [
  {
    id: 1,
    title: "Ultimate Southeast Asia Backpacking Guide",
    description: "Everything you need to know for an epic adventure",
    image: "/southeast-asia-backpacking-beach-palm-trees.jpg",
    downloads: "2.3k",
  },
  {
    id: 2,
    title: "European City Hopping on a Budget",
    description: "Visit 10 cities without breaking the bank",
    image: "/european-cities-architecture-panoramic.jpg",
    downloads: "1.8k",
  },
  {
    id: 3,
    title: "Photography Tips for Travel",
    description: "Capture stunning memories on your journey",
    image: "/travel-photography-camera-landscape-sunset.jpg",
    downloads: "3.1k",
  },
]

export function TravelGuides() {
  return (
    <section id="guides" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Free <span className="text-accent">Travel Guides</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Download our comprehensive guides to help plan your next adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card
              key={guide.id}
              className="group overflow-hidden border-2 hover:border-accent transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={guide.image || "/placeholder.svg"}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full p-2">
                  <Book className="w-5 h-5 text-accent" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{guide.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{guide.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{guide.downloads} downloads</span>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
