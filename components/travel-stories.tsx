"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, User, Pen, Trash2, Upload, Plus } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase-client"
import { useAdmin } from "@/contexts/admin-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Story {
  id: string
  title: string
  excerpt: string
  image_path: string
  author: string
  read_time: string
  category: string
  image?: string
}

export function TravelStories() {
  const { isAdmin } = useAdmin()
  const supabase = createSupabaseClient()
  const { toast } = useToast()

  const [stories, setStories] = useState<Story[]>([])

  const [imagePreview, setImagePreview] = useState<string>("")
  const [editing, setEditing] = useState<Story | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [isEditingMode, setIsEditingMode] = useState(false) // NEW


  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase.from("stories").select("*").order("created_at", { ascending: false })
      if (error) return toast({ variant: "destructive", title: "Error", description: error.message })

      const formatted = data.map((story) => ({
        ...story,
        image: supabase.storage.from("images").getPublicUrl(story.image_path).data.publicUrl,
      }))
      setStories(formatted)
    }
    fetchStories()
  }, [])

  const handleEdit = (story: Story) => {
    setIsEditingMode(true)
    setEditing(story)
    setImagePreview(story.image || "/placeholder.svg")
    setShowDialog(true)
  }
  
  const handleView = (story: Story) => {
    setIsEditingMode(false)
    setEditing(story)
    setImagePreview(story.image || "/placeholder.svg")
    setShowDialog(true)
  }
  

  const handleAdd = () => {
    setIsEditingMode(true) // <-- this is the missing line!
    setEditing({
      id: "",
      title: "",
      excerpt: "",
      image_path: "",
      author: "",
      read_time: "",
      category: "",
    })
    setImagePreview("/placeholder.svg")
    setShowDialog(true)
  }
  

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("stories").delete().eq("id", id)
    if (error) return toast({ variant: "destructive", title: "Delete failed", description: error.message })
    setStories(stories.filter((s) => s.id !== id))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editing) return

    const fileName = `${crypto.randomUUID()}.${file.name.split(".").pop()}`
    const { error } = await supabase.storage.from("images").upload(fileName, file)
    if (error) return toast({ variant: "destructive", title: "Upload error", description: error.message })

    setEditing({ ...editing, image_path: fileName })
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!editing) return
  
    const payload = {
      title: editing.title,
      excerpt: editing.excerpt,
      image_path: editing.image_path,
      author: editing.author,
      read_time: editing.read_time,
      category: editing.category,
    }
  
    const isUpdate = editing.id && editing.id.trim() !== ""
  
    const { data, error } = isUpdate
      ? await supabase.from("stories").update(payload).eq("id", editing.id).select("*").single()
      : await supabase.from("stories").insert(payload).select("*").single()
  
    if (error) {
      return toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message,
      })
    }
  
    const image = supabase.storage.from("images").getPublicUrl(data.image_path).data.publicUrl
    const updated = { ...data, image }
  
    setStories(isUpdate ? stories.map((s) => (s.id === updated.id ? updated : s)) : [updated, ...stories])
    setShowDialog(false)
    setEditing(null)
    toast({
      title: "Success",
      description: `Story ${isUpdate ? "updated" : "added"} successfully.`,
    })
  }
  

  return (
    <section id="stories" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Latest <span className="text-secondary">Slowandarain</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Real experiences, honest insights, and inspiring tales from the road
          </p>
        </div>

        {isAdmin && (
          <div className="text-center mb-6">
            <Button variant="outline" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" /> Add New Story
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="group overflow-hidden border-2 hover:border-secondary">
              {isAdmin && (
                <div className="flex justify-end gap-2 p-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(story)}>
                    <Pen className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(story.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              <div className="absolute top-4 left-4">
                <span className="backdrop-blur-sm bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {story.category}
                </span>
              </div>

              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">
                  {story.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
                  {story.excerpt}
                </p>

                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> <span>{story.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> <span>{story.read_time}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="group/btn hover:text-secondary hover:bg-black/20 cursor-pointer p-0 h-auto font-semibold"
                  onClick={() => handleView(story)}
                >
                  Read More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>

              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent className="max-w-xl">
    <DialogHeader>
      <DialogTitle>{isEditingMode ? (editing?.id ? "Edit Story" : "Add Story") : editing?.title}</DialogTitle>
      <DialogDescription>
        {isEditingMode ? "Fill in the details below" : editing?.category}
      </DialogDescription>
    </DialogHeader>

    {editing && (
      <div className="space-y-4">
        <div className="space-y-2">
          <img src={imagePreview} className="w-full h-48 object-cover rounded-md" alt="Preview" />
        </div>

        {isEditingMode ? (
          <>
            <div className="space-y-2">
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                rows={3}
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Read Time</Label>
              <Input
                value={editing.read_time}
                onChange={(e) => setEditing({ ...editing, read_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground leading-relaxed">{editing.excerpt}</p>
            <div className="text-sm text-muted-foreground">
              <p><strong>Author:</strong> {editing.author}</p>
              <p><strong>Read time:</strong> {editing.read_time}</p>
              <p><strong>Category:</strong> {editing.category}</p>
            </div>
          </>
        )}
      </div>
    )}
  </DialogContent>
</Dialog>

      </div>
    </section>
  )
}
