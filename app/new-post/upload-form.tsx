//app\new-post\upload-form.tsx
'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client' // ✅ now you're importing it

export default function UploadForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const supabase = createSupabaseClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const path = `images/${crypto.randomUUID()}.${fileExt}`
    const { error: uploadErr } = await supabase.storage
      .from('images')
      .upload(path, file, { upsert: false })

    if (uploadErr) return alert(uploadErr.message)

    const { data: { user } } = await supabase.auth.getUser()
    const { error: insertErr } = await supabase
      .from('posts')
      .insert({ title, content, image_path: path, user_id: user?.id })

    if (insertErr) return alert(insertErr.message)
    setTitle(''); setContent(''); setFile(null)
    alert('Post created!')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Trip to Kyoto" required />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write about your trip..." />
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} required />
      <button type="submit">Publish</button>
    </form>
  )
}
