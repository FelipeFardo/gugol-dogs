import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getUsersConnectedProject } from '@/ws/project-connections'

export async function getUsersByConnectProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:orgSlug/projects/:projectSlug/connections',
    {
      schema: {
        tags: ['projects'],
        summary: 'Get project details',
        params: z.object({
          orgSlug: z.string(),
          projectSlug: z.string(),
        }),
        response: {
          200: z.object({
            users: z.array(z.string()),
          }),
        },
      },
    },
    async (request, reply) => {
      const { projectSlug } = request.params

      const users = getUsersConnectedProject(projectSlug)
      if (!users) reply.send({ users: [] })
      if (users) {
        const constUsersId = Array.from(users?.keys())
        reply.send({ users: constUsersId })
      }

      return reply.send()
    },
  )
}
