import { redirect } from 'next/navigation'
import { getUser, getAccountBySubdomain } from '@/lib/supabase/auth'
import { headers } from 'next/headers'
import LoginForm from './login-form'
import Image from 'next/image'

export default async function LoginPage() {
  const user = await getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  // Get subdomain from headers
  const headersList = await headers()
  const subdomain = headersList.get('x-subdomain') || ''
  
  let account = null
  if (subdomain) {
    account = await getAccountBySubdomain(subdomain)
    if (!account) {
      // Invalid subdomain
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Kantoor niet gevonden
              </h2>
              <p className="mt-2 text-gray-600">
                Het opgegeven kantoor bestaat niet of is niet actief.
              </p>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {account?.logo_url ? (
            <Image
              className="mx-auto h-12 w-auto"
              src={account.logo_url}
              alt={account.name}
              width={48}
              height={48}
            />
          ) : (
            <div className="mx-auto h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          )}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Inloggen bij {account?.name || 'Saldoo'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Voer uw gegevens in om toegang te krijgen tot uw dashboard
          </p>
        </div>
        
        <LoginForm account={account} />
      </div>
    </div>
  )
}

export async function generateMetadata() {
  const headersList = await headers()
  const subdomain = headersList.get('x-subdomain') || ''
  
  let title = 'Inloggen - Saldoo'
  if (subdomain) {
    const account = await getAccountBySubdomain(subdomain)
    if (account) {
      title = `Inloggen - ${account.name}`
    }
  }
  
  return {
    title,
    description: 'Log in bij uw financiële dashboard',
  }
}
