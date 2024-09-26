'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'

export default function Projects() {
  const [content, setContent] = useState<string>('')

  const { project, slug } = useParams<{ slug: string; project: string }>()

  const ws = useProject({ orgSlug: slug, projectSlug: project })

  useEffect(() => {
    if (!ws) return

    const handleMessage = (event: MessageEvent) => {
      setContent(event.data)
    }

    ws.addEventListener('message', handleMessage)

    return () => {
      ws.removeEventListener('message', handleMessage)
    }
  }, [ws])

  const submitEdit = (content: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(content)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value
    setContent(newContent)
    submitEdit(newContent)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{project}</h1>
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Edit document"
        rows={30}
      />
    </div>
  )
}
