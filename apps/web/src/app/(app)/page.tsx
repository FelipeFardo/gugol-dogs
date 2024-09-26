import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import { getOrganizations } from '@/http/get-organizations'

import Home from './home-components'

export default async function HomePage() {
  if (isAuthenticated()) {
    const { organizations } = await getOrganizations()
    redirect(`/org/${organizations[0].slug}`)
  }
  return <Home />
}
