import { requireAuth, getUserProfile } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'
import DashboardHeader from './components/dashboard-header'
import DashboardContent from './components/dashboard-content'

export default async function DashboardPage() {
  await requireAuth()
  const profile = await getUserProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={profile} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DashboardContent user={profile} />
      </main>
    </div>
  )
}

export async function generateMetadata() {
  const profile = await getUserProfile()
  
  return {
    title: `Dashboard - ${profile?.account?.name || 'Saldoo'}`,
    description: 'Uw financiële dashboard met real-time KPI\'s en inzichten',
  }
}
