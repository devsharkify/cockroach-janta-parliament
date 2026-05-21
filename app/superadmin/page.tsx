import type { Metadata } from 'next'
import AdminDashboard from './AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Cockpit — Cockroach Janta Parliament',
  description: 'Internal admin dashboard. Not for public use.',
  robots: 'noindex, nofollow',
}

export default function SuperAdminPage() {
  return <AdminDashboard />
}
