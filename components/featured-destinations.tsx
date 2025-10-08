"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Edit, Plus, ChevronLeft, ChevronRight, Trash2, Upload, Pen } from "lucide-react"
import { useAdmin } from '@/contexts/admin-context'
import { createSupabaseClient } from '@/lib/supabase-client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface Destination {
  id: number
  title: string
  description: string
  image: string
  location: string
  date: string
}

export function FeaturedDestinations() {
  const { isAdmin } = useAdmin()
  const supabase = createSupabaseClient()
  const { toast } = useToast()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)


  // Duplicate destinations for infinite scroll effect
  const duplicatedDestinations = [...destinations, ...destinations, ...destinations]

  // Fetch destinations from Supabase on mount
  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order('created_at', { ascending: false })
  
      if (error) {
        console.error("Fetch error:", error.message)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load destinations",
        })
      } else if (data && data.length > 0) {
        setDestinations(data.map(post => ({
          id: post.id,
          title: post.title,
          description: post.content,
          image: supabase.storage.from("images").getPublicUrl(post.image_path).data.publicUrl,
          location: post.location || "Unknown",
          date: post.date || "Recent",
        })))
      }
    }
  
    fetchDestinations()
  }, [])

  // Auto-play carousel
  useEffect(() => {
    if (destinations.length === 0) return

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % destinations.length)
      }, 3000)
    }

    startAutoPlay()

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [destinations.length])

  const handleNext = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setCurrentSlide(prev => (prev + 1) % destinations.length)
  }

  const handlePrev = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setCurrentSlide(prev => (prev - 1 + destinations.length) % destinations.length)
  }

  const handleEdit = (destination: Destination) => {
    setEditingDestination({ ...destination })
    setImagePreview(destination.image)
    setShowEditDialog(true)
  }

  const handleAdd = () => {
    const newDestination: Destination = {
      id: Date.now(),
      title: '',
      description: '',
      image: '/placeholder.svg',
      location: '',
      date: '',
    }
    setEditingDestination(newDestination)
    setImagePreview('/placeholder.svg')
    setShowEditDialog(true)
  }

  const handleSave = async () => {
    if (!editingDestination) return
    
    setIsLoading(true)
    setUploadProgress(0)
  
    try {
      const isEditing = destinations.find(d => d.id === editingDestination.id)
  
      let imagePath = editingDestination.image
      
      // Upload image if it's base64
      if (imagePreview.startsWith("data:")) {
        setUploadProgress(20)
        const fileExt = imagePreview.substring(imagePreview.indexOf("/") + 1, imagePreview.indexOf(";"))
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        
        setUploadProgress(40)
        const response = await fetch(imagePreview)
        const blob = await response.blob()
  
        setUploadProgress(60)
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, blob, {
            contentType: `image/${fileExt}`,
            upsert: false
          })
  
        if (uploadError) {
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: uploadError.message,
          })
          setIsLoading(false)
          setUploadProgress(0)
          return
        }
  
        setUploadProgress(80)
        imagePath = fileName
      } else if (imagePath.startsWith('http')) {
        const urlParts = imagePath.split('/')
        imagePath = urlParts[urlParts.length - 1]
      }
  
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user?.id) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to save destinations",
        })
        setIsLoading(false)
        setUploadProgress(0)
        return
      }
  
      setUploadProgress(90)
      
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("posts")
          .update({
            title: editingDestination.title,
            content: editingDestination.description,
            image_path: imagePath,
            location: editingDestination.location,
            date: editingDestination.date,
          })
          .eq('id', editingDestination.id)
  
        if (updateError) {
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: updateError.message,
          })
          setIsLoading(false)
          setUploadProgress(0)
          return
        }
  
        const publicUrl = supabase.storage.from("images").getPublicUrl(imagePath).data.publicUrl
        setDestinations(destinations.map(d => 
          d.id === editingDestination.id ? { ...editingDestination, image: publicUrl } : d
        ))
      } else {
        const { data, error: insertError } = await supabase
          .from("posts")
          .insert({
            user_id: user.id,
            title: editingDestination.title,
            content: editingDestination.description,
            image_path: imagePath,
            location: editingDestination.location,
            date: editingDestination.date,
          })
          .select()
          .single()
  
        if (insertError) {
          toast({
            variant: "destructive",
            title: "Insert Failed",
            description: insertError.message,
          })
          setIsLoading(false)
          setUploadProgress(0)
          return
        }
  
        const publicUrl = supabase.storage.from("images").getPublicUrl(imagePath).data.publicUrl
        setDestinations([...destinations, { 
          ...editingDestination, 
          id: data.id,
          image: publicUrl
        }])
      }
  
      setUploadProgress(100)
      setShowEditDialog(false)
      setEditingDestination(null)
      setIsLoading(false)
      setUploadProgress(0)
      
      toast({
        title: "Success!",
        description: "Destination saved successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${error}`,
      })
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this destination?')) return
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: error.message,
        })
        return
      }
      
      setDestinations(destinations.filter(d => d.id !== id))
      toast({
        title: "Deleted",
        description: "Destination deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${error}`,
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        if (editingDestination) {
          setEditingDestination({ ...editingDestination, image: result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
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

          <div className="relative">
            {destinations.length > 0 ? (
              <>
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${(currentSlide + destinations.length) * (100 / 3)}%)`,
                    }}
                  >
                    {duplicatedDestinations.map((destination, index) => (
                      <div key={`${destination.id}-${index}`} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                        <Card className="group overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
                          {isAdmin && (
                            <div className="flex justify-end gap-2 p-4">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleEdit(destination)}
                              >
                                <Pen className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
                                onClick={() => handleDelete(destination.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

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
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    className="pointer-events-auto bg-background/80 backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    className="pointer-events-auto bg-background/80 backdrop-blur-sm"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                  {destinations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (autoPlayRef.current) clearInterval(autoPlayRef.current)
                        setCurrentSlide(index)
                      }}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide % destinations.length
                          ? 'w-8 bg-primary'
                          : 'w-2 bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No destinations yet</p>
              </div>
            )}

            {isAdmin && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleAdd} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Destination
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDestination?.title ? 'Edit' : 'Add'} Destination</DialogTitle>
            <DialogDescription>
              Update the destination details and image
            </DialogDescription>
          </DialogHeader>
          {editingDestination && (
            <div className="space-y-4">
              {isLoading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="space-y-2">
                <Label>Image</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Upload className="h-4 w-4" />
                      Click to upload image
                    </div>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingDestination.title}
                  onChange={(e) => setEditingDestination({ ...editingDestination, title: e.target.value })}
                  placeholder="Enter destination title"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingDestination.description}
                  onChange={(e) => setEditingDestination({ ...editingDestination, description: e.target.value })}
                  placeholder="Enter destination description"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingDestination.location}
                    onChange={(e) => setEditingDestination({ ...editingDestination, location: e.target.value })}
                    placeholder="e.g., Greece"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    value={editingDestination.date}
                    onChange={(e) => setEditingDestination({ ...editingDestination, date: e.target.value })}
                    placeholder="e.g., March 2024"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}