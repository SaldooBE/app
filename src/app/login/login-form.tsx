'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { registerAccountant } from '@/lib/supabase/registration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

interface LoginFormProps {
  account: {
    id: string
    name: string
    logo_url: string | null
    primary_color: string
    contrast_color: string
  } | null
}

export default function LoginForm({ account }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [subdomain, setSubdomain] = useState('')

  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Redirect will happen automatically via middleware
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Er is een fout opgetreden bij het inloggen'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (password !== confirmPassword) {
        throw new Error('Wachtwoorden komen niet overeen')
      }

      if (password.length < 6) {
        throw new Error('Wachtwoord moet minimaal 6 karakters bevatten')
      }

      if (!firstName || !lastName || !companyName || !subdomain) {
        throw new Error('Vul alle velden in')
      }

      // Validate subdomain format
      if (!/^[a-z0-9-]+$/.test(subdomain)) {
        throw new Error('Subdomeinnaam mag alleen letters, cijfers en streepjes bevatten')
      }

      if (subdomain.length < 3) {
        throw new Error('Subdomeinnaam moet minimaal 3 karakters bevatten')
      }

      // Register the accountant
      await registerAccountant({
        email,
        password,
        firstName,
        lastName,
        companyName,
        subdomain: subdomain.toLowerCase()
      })

      toast.success('Account succesvol aangemaakt! U kunt nu inloggen.')
      setIsRegistering(false)
      
      // Clear form
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setFirstName('')
      setLastName('')
      setCompanyName('')
      setSubdomain('')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Er is een fout opgetreden bij het registreren'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const primaryColor = account?.primary_color || '#1e40af'
  const contrastColor = account?.contrast_color || '#ffffff'

  return (
    <Card className="p-8">
      <div className="mb-6">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
              !isRegistering
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Inloggen
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
              isRegistering
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Registreren
          </button>
        </div>
      </div>

      <form onSubmit={isRegistering ? handleRegister : handleSignIn} className="space-y-6">
        {isRegistering && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  Voornaam
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                  placeholder="Uw voornaam"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Achternaam
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1"
                  placeholder="Uw achternaam"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                Naam boekhoudkantoor
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
                placeholder="Uw boekhoudkantoor naam"
              />
            </div>

            <div>
              <Label htmlFor="subdomain" className="text-sm font-medium text-gray-700">
                Subdomeinnaam
              </Label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="subdomain"
                  name="subdomain"
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="rounded-r-none"
                  placeholder="mijnkantoor"
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                  .saldoo.be
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Dit wordt uw unieke webadres: {subdomain || 'mijnkantoor'}.saldoo.be
              </p>
            </div>
          </>
        )}

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            E-mailadres
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            placeholder="uw@email.com"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Wachtwoord
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
            placeholder={isRegistering ? "Minimaal 6 karakters" : "Uw wachtwoord"}
          />
        </div>

        {isRegistering && (
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Wachtwoord bevestigen
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
              placeholder="Herhaal uw wachtwoord"
            />
          </div>
        )}

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            style={{
              backgroundColor: primaryColor,
              color: contrastColor,
            }}
          >
            {isLoading 
              ? (isRegistering ? 'Bezig met registreren...' : 'Bezig met inloggen...') 
              : (isRegistering ? 'Account aanmaken' : 'Inloggen')
            }
          </Button>
        </div>

        {!isRegistering && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Nog geen account? Gebruik de registratietab hierboven.
            </p>
          </div>
        )}
      </form>
    </Card>
  )
}
