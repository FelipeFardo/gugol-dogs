'use client'

import Document from '@tiptap/extension-document'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { Editor, type OnContentUpdatedParams } from '@/components/editor'
import { editProject } from '@/ws/edit-project'

export default function Projects() {
  const { project, slug } = useParams<{
    slug: string
    project: string
  }>()

  const editor = useEditor({
    extensions: [
      Document.extend({
        content: 'heading block*',
      }),
      StarterKit.configure({
        document: false,
      }),
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder: 'Untitled',
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:h-0 before:text-gray-500 before:float-left before:pointer-events-none',
      }),
    ],

    onUpdate: ({ editor }) => {
      handleEditorContentUpdated(editor.getHTML())
    },
    content: '',
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose dark:prose-invert',
      },
    },
  })

  useEffect(() => {
    const ws = editProject({
      orgSlug: slug,
      projectSlug: project,
    })

    ws.onmessage = (event: MessageEvent) => {
      if (editor) {
        editor.commands.setContent(event.data)
      }
    }

    return () => {
      ws.close()
    }
  }, [editor])

  function handleEditorContentUpdated(content: string) {
    const ws = editProject({
      orgSlug: slug,
      projectSlug: project,
    })

    ws.onopen = () => {
      ws.send(content)
      ws.close()
    }
  }

  function handleEditorContentUpdatedd({
    content,
    title,
  }: OnContentUpdatedParams) {
    console.log('title')
    console.log(title)
    console.log('title')
    console.log(content)
  }

  return (
    <div className="space-y-4">
      <pre>{content ?? ''}</pre>
      {/* <EditorContent className="w-[65ch]" editor={editor} /> */}
      <Editor
        onContentUpdated={handleEditorContentUpdatedd}
        content={'initialContent'}
      />
    </div>
  )
}
