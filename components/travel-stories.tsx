import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, User } from "lucide-react"

const stories = [
  {
    id: 1,
    title: "Hiking Through the Swiss Alps",
    excerpt: "A week-long adventure through pristine mountain trails and charming villages",
    image: "/swiss-alps-hiking-trail-panoramic-mountain-view.jpg",
    author: "Sarah Johnson",
    readTime: "8 min read",
    category: "Adventure",
  },
  {
    id: 2,
    title: "Street Food Tour in Bangkok",
    excerpt: "Discovering the vibrant flavors and culinary traditions of Thailand",
    image: "/bangkok-street-food-market-colorful-vibrant.jpg",
    author: "Michael Chen",
    readTime: "6 min read",
    category: "Food & Culture",
  },
  {
    id: 3,
    title: "Safari Adventures in Kenya",
    excerpt: "Witnessing the incredible wildlife of the African savanna",
    image: "/kenya-safari-wildlife-elephants-panoramic-savanna.jpg",
    author: "Emma Williams",
    readTime: "10 min read",
    category: "Wildlife",
  },
  {
    id: 4,
    title: "Northern Lights in Iceland",
    excerpt: "Chasing the aurora borealis across Iceland's dramatic landscapes",
    image: "/iceland-northern-lights-aurora-borealis-panoramic.jpg",
    author: "David Anderson",
    readTime: "7 min read",
    category: "Nature",
  },
]

export function TravelStories() {
  return (
    <section id="stories" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Latest <span className="text-secondary">Travel Stories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Real experiences, honest insights, and inspiring tales from the road
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="group overflow-hidden border-2 hover:border-secondary transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {story.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">{story.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{story.excerpt}</p>
                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{story.readTime}</span>
                  </div>
                </div>
                <Button variant="ghost" className="group/btn hover:text-secondary p-0 h-auto font-semibold">
                  Read More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
          >
            View All Stories
          </Button>
        </div>
      </div>
    </section>
  )
}
