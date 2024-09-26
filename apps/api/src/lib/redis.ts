import { env } from '@gugol-dogs/env'
import { Redis } from 'ioredis'

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})
