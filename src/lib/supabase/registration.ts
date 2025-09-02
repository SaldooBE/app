import { createClient } from './client'

export interface RegistrationData {
  email: string
  password: string
  firstName: string
  lastName: string
  companyName: string
  subdomain: string
}

export async function registerAccountant(data: RegistrationData) {
  const supabase = createClient()
  
  try {
    // Check if subdomain is available
    const { data: isAvailable, error: checkError } = await supabase
      .rpc('is_subdomain_available', { subdomain_name: data.subdomain })
    
    if (checkError) {
      throw new Error('Kon subdomeinnaam niet controleren')
    }
    
    if (!isAvailable) {
      throw new Error('Deze subdomeinnaam is al in gebruik')
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          company_name: data.companyName,
          subdomain: data.subdomain.toLowerCase(),
        }
      }
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('Gebruiker kon niet worden aangemaakt')
    }

    // Create account and user profile
    const { data: accountId, error: profileError } = await supabase.rpc('create_account_and_user', {
      user_id: authData.user.id,
      user_email: data.email,
      user_first_name: data.firstName,
      user_last_name: data.lastName,
      account_name: data.companyName,
      account_subdomain: data.subdomain.toLowerCase()
    })

    if (profileError) {
      throw profileError
    }

    return {
      user: authData.user,
      accountId,
      subdomain: data.subdomain.toLowerCase()
    }
  } catch (error) {
    throw error
  }
}

export async function checkSubdomainAvailability(subdomain: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { data: isAvailable, error } = await supabase
      .rpc('is_subdomain_available', { subdomain_name: subdomain.toLowerCase() })
    
    if (error) {
      console.error('Error checking subdomain availability:', error)
      return false
    }
    
    return isAvailable || false
  } catch (error) {
    console.error('Error checking subdomain availability:', error)
    return false
  }
}
