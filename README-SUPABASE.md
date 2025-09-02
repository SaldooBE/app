# Saldoo MVP - Supabase Integration Guide

## ✅ Integration Complete

Your Saldoo MVP now has a fully integrated Supabase backend with:

- **Authentication** with email/password
- **Multitenancy** via subdomains (`{kantoornaam}.saldoo.be`)
- **Row Level Security** for data isolation
- **Dutch UI** throughout the application
- **Whitelabel branding** support

## 📋 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root with your Supabase credentials:

```env
# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Your Supabase service role key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret for token verification
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Base domain for multitenancy
NEXT_PUBLIC_BASE_DOMAIN=saldoo.be

# Environment
NODE_ENV=development
```

### 2. Database Setup

Run the SQL schema in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Update the JWT secret in the first line
5. Execute the script

This will create:
- All necessary tables
- Row Level Security policies
- Sample data for testing

### 3. DNS Configuration (For Production)

For subdomain support, configure your DNS:

```
# Add these DNS records for your domain
*.saldoo.be CNAME your-vercel-app.vercel.app
demo.saldoo.be CNAME your-vercel-app.vercel.app
```

### 4. Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 🏗️ Database Schema

### Core Tables

1. **accounts** - Accounting firms (boekhoudkantoren)
2. **users** - Both accountants and entrepreneurs
3. **companies** - SME clients (KMO-klanten)
4. **financial_data** - KPI data from Exact Online
5. **expense_categories** - Expense breakdowns
6. **faqs** - Frequently asked questions

### User Roles

- **accountant** - Can view all clients' data (read-only)
- **entrepreneur** - Can only view their own company data

## 🔐 Authentication Flow

### Registration (New Accounting Firms):
1. User visits `/login` and clicks "Registreren"
2. Fills out registration form with company details
3. System validates subdomain availability
4. Creates Supabase Auth user + account + user profile atomically
5. User can immediately login with new credentials

### Login:
1. User visits `{subdomain}.saldoo.be/login` or `/login`
2. System identifies accounting firm by subdomain (if provided)
3. User logs in with email/password
4. Middleware validates session and applies RLS
5. Dashboard shows appropriate data based on role

### Features:
- ✅ **Registration Form**: Toggle between login/register
- ✅ **Subdomain Validation**: Real-time availability checking
- ✅ **Form Validation**: Dutch error messages
- ✅ **Atomic Operations**: Account + user creation in single transaction
- ✅ **Security**: RLS automatically applied to new accounts

## 🎨 Whitelabel Features

- **Logo** - Upload in Supabase storage, reference in accounts table
- **Primary Color** - Used for buttons, headers, accent elements
- **Contrast Color** - Used for text on primary color backgrounds

## 🔒 Security Features

- **Row Level Security** - Data isolation between accounts
- **Role-based Access** - Entrepreneurs only see their data
- **Subdomain Validation** - Invalid subdomains show error page
- **Authentication Middleware** - Protects all dashboard routes

## 🧪 Testing

### Create Test Data

```sql
-- Create a test accounting firm
INSERT INTO accounts (name, subdomain, primary_color, contrast_color) 
VALUES ('Test Kantoor', 'test', '#1e40af', '#ffffff');

-- Create test users (replace with actual auth.users IDs after registration)
INSERT INTO users (id, email, first_name, last_name, role, account_id)
VALUES 
  ('user-id-1', 'accountant@test.com', 'Jan', 'Janssen', 'accountant', 'account-id'),
  ('user-id-2', 'ondernemer@test.com', 'Piet', 'Pietersen', 'entrepreneur', 'account-id');
```

### Test Scenarios

1. **Login as Accountant** - Should see client overview
2. **Login as Entrepreneur** - Should see personal dashboard
3. **Invalid Subdomain** - Should show "Kantoor niet gevonden"
4. **Unauthenticated Access** - Should redirect to login

## 🚀 Next Steps

### Phase 1 (Current MVP)
- ✅ Authentication & Multitenancy
- ✅ Basic Dashboard Structure
- 🔄 Add dummy financial data
- 🔄 Implement KPI calculations
- 🔄 Add charts and graphs

### Phase 2 (Future)
- Exact Online API integration
- AI chatbot for FAQ
- Email notifications
- Advanced reporting

## 📝 Key Files

- `src/lib/supabase/` - Supabase client configuration
- `src/middleware.ts` - Authentication and subdomain handling
- `src/app/login/` - Login page with whitelabel support
- `src/app/dashboard/` - Main dashboard interface
- `supabase-schema.sql` - Complete database schema

## 🆘 Troubleshooting

### Common Issues

1. **"Invalid login credentials"** - Check if user exists in both auth.users and public.users
2. **RLS errors** - Ensure user has correct account_id in users table
3. **Subdomain not working** - Check middleware configuration and DNS settings
4. **Styling issues** - Verify Tailwind CSS is properly configured

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Verify database connection
# Use Supabase dashboard > API docs > Test connection
```

## 📞 Support

For issues specific to this integration, check:

1. Supabase dashboard logs
2. Browser developer console
3. Next.js development logs
4. Database query logs in Supabase

---

**🎉 Your Saldoo MVP is now ready with full Supabase integration!**

The MCP server should run perfectly with proper authentication, multitenancy, and Dutch localization throughout the application.
