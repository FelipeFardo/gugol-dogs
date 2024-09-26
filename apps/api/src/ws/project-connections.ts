import { WebSocket } from 'ws'

import { prisma } from '@/lib/prisma'

const projects: Map<string, Map<string, WebSocket>> = new Map()

export function addUserToProject(
  projectSlug: string,
  userId: string,
  ws: WebSocket,
) {
  let usersMap = projects.get(projectSlug)
  if (!usersMap) {
    usersMap = new Map<string, WebSocket>()
    projects.set(projectSlug, usersMap)
  }
  usersMap.set(userId, ws)
}

export function removeUserFromProject(projectSlug: string, userId: string) {
  const usersMap = projects.get(projectSlug)
  if (usersMap) {
    usersMap.delete(userId)

    if (usersMap.size === 0) {
      projects.delete(projectSlug)
    }
  }
}

export function getUserWebSocket(
  projectSlug: string,
  userId: string,
): WebSocket | undefined {
  const usersMap = projects.get(projectSlug)
  return usersMap?.get(userId)
}

export function getUsersConnectedProject(
  projectSlug: string,
): Map<string, WebSocket> | undefined {
  return projects.get(projectSlug)
}

// Pegar o projeto do cache e enviar para o usuário
export async function userConnect({
  connection,
  projectSlug,
  userId,
}: {
  projectSlug: string
  userId: string
  connection: WebSocket
}) {
  addUserToProject(projectSlug, userId, connection)

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
  })

  connection.send(project?.content || '')
}

// Atualizar o projeto no cache e mandar para todos os usuários connectados nesse projeto
export async function updateProject({
  connection,
  message,
  projectSlug,
}: {
  projectSlug: string
  message: string
  connection: WebSocket
}) {
  await prisma.project.update({
    data: {
      content: message.toString(),
    },
    where: {
      slug: projectSlug,
    },
  })

  const users = getUsersConnectedProject(projectSlug)
  if (!users) return
  for (const user of users) {
    const client = user[1]

    if (client !== connection && client.readyState === WebSocket.OPEN) {
      client.send(message.toString())
    }
  }
}

// remover usuário(websocket) do projeto
export function desconnectUserFromProject(projectSlug: string, userId: string) {
  removeUserFromProject(projectSlug, userId)
}
