import { env } from '@gugol-dogs/env'

import { getAddressFromUrl } from '@/lib/get-address-from-url'

export function editProject({
  orgSlug,
  projectSlug,
}: {
  orgSlug: string
  projectSlug: string
}) {
  const url = env.NEXT_PUBLIC_API_URL
  const address = getAddressFromUrl(url)

  const ws = new WebSocket(
    `ws://${address}/organizations/${orgSlug}/projects/${projectSlug}/edit`,
  )

  return ws
}
