import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { extractToken } from '@/utils/extract-token-ws'
import { applyOperation, Operation } from '@/utils/operation-transform'
import {
  desconnectUserFromProject,
  updateProject,
  userConnect,
} from '@/ws/project-connections'

interface Message {
  type: string
  operation?: Operation
  document?: string
  history?: Operation[]
}

export async function editProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()

    .get(
      '/organizations/:orgSlug/projects/:projectSlug/edit',
      {
        websocket: true,
        schema: {
          tags: ['projects'],
          summary: 'Edit project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
        },
      },
      async (connection, request) => {
        const { sub: userId } = app.jwt.verify<{ sub: string }>(
          extractToken(request.headers.cookie),
        )

        const { projectSlug } = request.params
        // Quando o usuário se connectar no websocket
        await userConnect({
          connection,
          projectSlug,
          userId,
        })

        // Evento quando o usuário enviar uma operação para editar o documento
        connection.on('message', async (message: string) => {
          const data: Message = JSON.parse(message)

          if (data.type === 'operation' && data.operation) {
            const operation = data.operation

            // Aplicar operação localmente
            const project = await prisma.project.findUnique({
              where: { slug: projectSlug },
            })

            if (!project) return

            // Aplica a operação e retorna o novo documento
            const document = applyOperation(project.content, operation)

            // Insere a operação no banco de dados
            await prisma.operation.create({
              data: {
                chars: data.operation.chars,
                index: data.operation.index,
                type: data.operation.type,
                projectId: project.id,
              },
            })

            await updateProject({
              connection,
              projectSlug,
              operation,
              content: document,
            })
          }
        })

        // Quando o usuário se desconectar
        connection.on('close', async () => {
          desconnectUserFromProject(projectSlug, userId)
        })
      },
    )
}
