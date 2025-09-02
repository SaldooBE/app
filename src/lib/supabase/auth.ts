import { createClient } from './server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('users')
    .select(`
      *,
      account:accounts(*),
      company:companies(*)
    `)
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return profile
}

export async function getAccountBySubdomain(subdomain: string) {
  const supabase = await createClient()
  
  const { data: account, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching account by subdomain:', error)
    return null
  }

  return account
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireAccountant() {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'accountant') {
    redirect('/dashboard')
  }
  return profile
}
