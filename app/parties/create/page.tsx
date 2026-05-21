import type { Metadata } from 'next'
import CreatePartyFlow from './CreatePartyFlow'

export const metadata: Metadata = {
  title: 'Start a Party',
  description: 'Create your own cockroach political party and contest 543 Lok Sabha seats.',
}

export default function CreatePartyPage() {
  return <CreatePartyFlow />
}
