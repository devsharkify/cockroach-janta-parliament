import { redirect } from 'next/navigation'

export default function CreatePartyRedirect() {
  redirect('/parties/create')
}
