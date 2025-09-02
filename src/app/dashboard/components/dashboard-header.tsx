'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface DashboardHeaderProps {
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    role: 'accountant' | 'entrepreneur'
    account: {
      id: string
      name: string
      logo_url: string | null
      primary_color: string
      contrast_color: string
    }
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const primaryColor = user.account?.primary_color || '#1e40af'
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {user.account?.logo_url ? (
              <Image
                className="h-8 w-auto"
                src={user.account.logo_url}
                alt={user.account.name}
                width={32}
                height={32}
              />
            ) : (
              <div 
                className="h-8 w-8 rounded flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-white font-bold text-sm">
                  {user.account?.name?.charAt(0) || 'S'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {user.role === 'entrepreneur' ? 'Mijn Dashboard' : 'Klanten Overzicht'}
              </h1>
              <p className="text-sm text-gray-500">
                {user.account?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback style={{ backgroundColor: primaryColor, color: user.account?.contrast_color || '#ffffff' }}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user.role === 'accountant' ? 'Accountant' : 'Ondernemer'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
