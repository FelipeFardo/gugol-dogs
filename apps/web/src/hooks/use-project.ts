'use client'
import { useEffect, useState } from 'react'

import { editProject } from '@/ws/edit-project'

const useProject = ({
  orgSlug,
  projectSlug,
}: {
  orgSlug: string
  projectSlug: string
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = editProject({ orgSlug, projectSlug })

    setWs(ws)

    return () => {
      ws.close()
    }
  }, [orgSlug, projectSlug])

  return ws
}

export default useProject
