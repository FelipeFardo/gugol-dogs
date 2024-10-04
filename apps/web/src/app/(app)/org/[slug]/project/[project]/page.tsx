'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'

interface Operation {
  index: number
  chars: string
  type: 'insert' | 'delete'
}

interface Message {
  type: string
  document?: string
  history?: Operation[]
  operation?: Operation
}

export default function Projects() {
  const [content, setContent] = useState<string>('')

  const { project, slug } = useParams<{ slug: string; project: string }>()

  const ws = useProject({ orgSlug: slug, projectSlug: project })

  useEffect(() => {
    if (!ws) return

    // Receber dados do WebSocket
    ws.onmessage = (message: MessageEvent) => {
      const data: Message = JSON.parse(message.data)
      if (data.type === 'init' && data.document) {
        setContent(data.document)
      } else if (data.type === 'operation' && data.operation) {
        console.log(data)
        applyRemoteOperation(data.operation)
      }
    }
  }, [ws])

  // Função para aplicar operações de outros clientes
  const applyRemoteOperation = (operation: Operation) => {
    const { index, chars, type } = operation
    setContent((prevDoc) => {
      if (type === 'insert') {
        return prevDoc.slice(0, index) + chars + prevDoc.slice(index)
      } else if (type === 'delete') {
        return prevDoc.slice(0, index) + prevDoc.slice(index + chars.length)
      }
      return prevDoc
    })
  }

  // Função para enviar operações ao servidor
  const handleOperation = (
    index: number,
    chars: string,
    type: 'insert' | 'delete',
  ) => {
    const operation: Operation = { index, chars, type }
    ws?.send(JSON.stringify({ type: 'operation', operation }))
    applyRemoteOperation(operation)
  }

  // Manipular edição de texto
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    const diffIndex = getDiffIndex(content, newText)

    if (newText.length > content.length) {
      // Inserção
      const insertedText = newText.slice(diffIndex)
      handleOperation(diffIndex, insertedText, 'insert')
    } else if (newText.length < content.length) {
      // Deleção
      const deletedText = content.slice(diffIndex)
      handleOperation(diffIndex, deletedText, 'delete')
    }
  }

  // Função para detectar a diferença entre as versões do documento
  const getDiffIndex = (oldText: string, newText: string) => {
    let i = 0
    while (
      i < oldText.length &&
      i < newText.length &&
      oldText[i] === newText[i]
    ) {
      i++
    }
    return i
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
