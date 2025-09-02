export interface Database {
  public: {
    Tables: {
      // Accounts represent the accounting firms (boekhoudkantoren)
      accounts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          subdomain: string
          logo_url: string | null
          primary_color: string
          contrast_color: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          subdomain: string
          logo_url?: string | null
          primary_color?: string
          contrast_color?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          subdomain?: string
          logo_url?: string | null
          primary_color?: string
          contrast_color?: string
          is_active?: boolean
        }
      }
      
      // Users can be either accountants or entrepreneurs
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          first_name: string
          last_name: string
          role: 'accountant' | 'entrepreneur'
          account_id: string
          company_id: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          first_name: string
          last_name: string
          role: 'accountant' | 'entrepreneur'
          account_id: string
          company_id?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'accountant' | 'entrepreneur'
          account_id?: string
          company_id?: string | null
          is_active?: boolean
        }
      }
      
      // Companies represent the SME clients (KMO-klanten)
      companies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          account_id: string
          exact_online_division: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          account_id: string
          exact_online_division?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          account_id?: string
          exact_online_division?: string | null
          is_active?: boolean
        }
      }
      
      // Financial data from Exact Online (dummy data for MVP)
      financial_data: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          company_id: string
          year: number
          month: number
          revenue: number
          expenses: number
          net_result: number
          gross_margin: number
          tax_estimate: number
          data_source: 'dummy' | 'exact_online'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          company_id: string
          year: number
          month: number
          revenue: number
          expenses: number
          net_result: number
          gross_margin: number
          tax_estimate: number
          data_source?: 'dummy' | 'exact_online'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          company_id?: string
          year?: number
          month?: number
          revenue?: number
          expenses?: number
          net_result?: number
          gross_margin?: number
          tax_estimate?: number
          data_source?: 'dummy' | 'exact_online'
        }
      }
      
      // Expense categories for breakdown charts
      expense_categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          company_id: string
          year: number
          month: number
          category_name: string
          amount: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          company_id: string
          year: number
          month: number
          category_name: string
          amount: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          company_id?: string
          year?: number
          month?: number
          category_name?: string
          amount?: number
        }
      }
      
      // FAQ entries that accountants can manage
      faqs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          account_id: string
          question: string
          answer: string
          category: string
          is_active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          account_id: string
          question: string
          answer: string
          category: string
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          account_id?: string
          question?: string
          answer?: string
          category?: string
          is_active?: boolean
          sort_order?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'accountant' | 'entrepreneur'
      data_source: 'dummy' | 'exact_online'
    }
  }
}

export type UserRole = Database['public']['Enums']['user_role']
export type DataSource = Database['public']['Enums']['data_source']
