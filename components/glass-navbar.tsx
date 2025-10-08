"use client"

import { useState } from 'react'
import { Menu, X, User, LogOut, MapPin, BookOpen, Compass, MessageCircle, Mail } from "lucide-react"

import { useAdmin } from '@/contexts/admin-context'
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

export function GlassNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAdmin, login, logout } = useAdmin()

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    const success = await login(username, password)
    
    setIsLoading(false)
    
    if (success) {
      setShowLoginDialog(false)
      setUsername('')
      setPassword('')
      setError('')
    } else {
      setError('Invalid email or password')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Slowanderain
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
  <a href="#destinations" className="hover:text-primary flex items-center gap-1 transition-colors">
    <MapPin className="w-4 h-4" />
    Destinations
  </a>
  <a href="#stories" className="hover:text-primary flex items-center gap-1 transition-colors">
    <BookOpen className="w-4 h-4" />
    Stories
  </a>
  <a href="#guides" className="hover:text-primary flex items-center gap-1 transition-colors">
    <Compass className="w-4 h-4" />
    Guides
  </a>
  <a href="#feedback" className="hover:text-primary flex items-center gap-1 transition-colors">
    <MessageCircle className="w-4 h-4" />
    Feedbacks
  </a>
  {isAdmin ? (
    <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  ) : (
    <Button variant="outline" size="sm" onClick={() => setShowLoginDialog(true)} className="flex items-center gap-2">
      <User className="w-4 h-4" />
      Admin
    </Button>
  )}
</div>


            <div className="md:hidden flex items-center gap-2">
              {isAdmin ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginDialog(true)}
                >
                  <User className="w-4 h-4" />
                </Button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border/40 backdrop-blur-md bg-background/95">
            <div className="px-4 py-4 space-y-3">
              <a href="#destinations" className="flex items-center gap-2 py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                <MapPin className="w-4 h-4" /> Destinations
              </a>
              <a href="#stories" className="flex items-center gap-2 py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                <BookOpen className="w-4 h-4" /> Stories
              </a>
              <a href="#guides" className="flex items-center gap-2 py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                <Compass className="w-4 h-4" /> Guides
              </a>
              <a href="#feedback" className="flex items-center gap-2 py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                <MessageCircle className="w-4 h-4" /> Feedbacks
              </a>
            </div>
          </div>

        )}
      </nav>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
            <DialogDescription>
              Enter your email and password to access admin features
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="admin@example.com"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}