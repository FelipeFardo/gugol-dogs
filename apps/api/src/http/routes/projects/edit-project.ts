import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { extractToken } from '@/utils/extract-token-ws'
import {
  desconnectUserFromProject,
  updateProject,
  userConnect,
} from '@/ws/project-connections'

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
        userConnect({
          connection,
          projectSlug,
          userId,
        })

        connection.on('message', async (message: string) => {
          // Aqui dentro pode e deve ser feita toda lógica
          // Quando o usuário mandar uma mensagem
          // O websocket transmite as mensagem como string
          // Cabe o backend transformar a mensagem em uma strutura de dados
          // O Front manda uma mensagem, por exemplo:
          // operation =  { type: 'insert', text: 'Hello world', pos: 3}
          // ou
          // operation = { type: 'delete', pos: 5, length: '4'}
          // const message = JSON.stringfy(operation)
          // Agora message é uma string

          // No backend usamos o processo inverso:
          // const operation JSON.parse(message)
          // Podemos agora criar toda a lógica
          // Por exemplo: if (operation.type == "insert") {console.log("O usuário digitou um texto")}

          // Por enquanto está apenas editando o projeto para todos usuários
          await updateProject({
            connection,
            projectSlug,
            message,
          })
        })

        // Quando o usuário se desconectar
        connection.on('close', async () => {
          desconnectUserFromProject(projectSlug, userId)
        })
      },
    )
}
