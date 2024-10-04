import { WebSocket } from 'ws'

import { prisma } from '@/lib/prisma'
import { Operation } from '@/utils/operation-transform'

const projects: Map<string, Map<string, WebSocket>> = new Map()

interface Message {
  type: string
  operation?: Operation
  document?: string
  history?: Operation[]
}

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

// Pegar o projeto completo e enviar para o usuário
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
    include: { operations: true },
  })

  const initialMessage: Message = {
    type: 'init',
    document: project?.content,
    history: project?.operations,
  }

  connection.send(JSON.stringify(initialMessage))
}

// Atualizar o projeto no cache e mandar para todos os usuários connectados nesse projeto
export async function updateProject({
  connection,
  content,
  projectSlug,
  operation,
}: {
  projectSlug: string
  content: string
  operation: Operation
  connection: WebSocket
}) {
  // Atualiza no banco de dados
  await prisma.project.update({
    data: {
      content,
    },
    where: {
      slug: projectSlug,
    },
  })

  // Busca os WebSoockets conectados nesse documento
  // E envia o operação para montar o documento em suas máquinas
  const users = getUsersConnectedProject(projectSlug)

  if (!users) return
  for (const user of users) {
    console.log(user[0])
    const client = user[1]

    if (client !== connection && client.readyState === WebSocket.OPEN) {
      const messageToSend: Message = { type: 'operation', operation }
      client.send(JSON.stringify(messageToSend))
    }
  }
}

// remover usuário(websocket) do projeto
export function desconnectUserFromProject(projectSlug: string, userId: string) {
  removeUserFromProject(projectSlug, userId)
}
