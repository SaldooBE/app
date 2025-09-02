import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
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

interface DashboardContentProps {
  user: User
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const isEntrepreneur = user.role === 'entrepreneur'
  
  if (isEntrepreneur) {
    return <EntrepreneurDashboard user={user} />
  }
  
  return <AccountantDashboard />
}

function EntrepreneurDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Omzet"
          value="€ 12.450"
          subtitle="Deze maand"
          trend="+12.5%"
          color={user.account?.primary_color}
        />
        <KPICard
          title="Uitgaven"
          value="€ 8.320"
          subtitle="Deze maand"
          trend="-3.2%"
          color={user.account?.primary_color}
        />
        <KPICard
          title="Nettoresultaat"
          value="€ 4.130"
          subtitle="Deze maand"
          trend="+18.7%"
          color={user.account?.primary_color}
        />
        <KPICard
          title="Belastingprognose"
          value="€ 1.240"
          subtitle="Op te zetten"
          trend=""
          color={user.account?.primary_color}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Omzet & Uitgaven</CardTitle>
            <CardDescription>Ontwikkeling per maand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-gray-500">
              Grafiek wordt geladen...
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Uitgaven per Categorie</CardTitle>
            <CardDescription>Verdeling deze maand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-gray-500">
              Grafiek wordt geladen...
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fiscale Kalender</CardTitle>
            <CardDescription>Aankomende deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">BTW Aangifte</p>
                  <p className="text-sm text-gray-600">Q4 2024</p>
                </div>
                <span className="text-sm font-medium text-yellow-600">15 feb</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Voorafbetaling</p>
                  <p className="text-sm text-gray-600">Vennootschapsbelasting</p>
                </div>
                <span className="text-sm font-medium text-blue-600">20 mrt</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Veelgestelde Vragen</CardTitle>
            <CardDescription>Handige informatie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <p className="font-medium text-sm">Wanneer moet ik mijn BTW betalen?</p>
              </div>
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <p className="font-medium text-sm">Hoeveel belastingen moet ik opzijzetten?</p>
              </div>
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <p className="font-medium text-sm">Wat zijn aftrekbare kosten?</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AccountantDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Klanten Overzicht</CardTitle>
          <CardDescription>Alle klanten die actief zijn op het Saldoo platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">Nog geen klanten ingesteld</p>
            <p className="text-sm text-gray-400 mt-2">
              Klanten worden hier weergegeven wanneer ze toegang hebben tot hun dashboard
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  color = '#1e40af' 
}: { 
  title: string
  value: string
  subtitle: string
  trend: string
  color?: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
          {trend && (
            <div className="text-right">
              <span 
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  trend.startsWith('+') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
