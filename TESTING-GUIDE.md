# Saldoo MVP - Testing Guide

## 🧪 Complete Registration and Login Flow Testing

### Prerequisites

1. **Environment Setup**:
   - Ensure your `.env.local` file has valid Supabase credentials
   - Run the `supabase-schema.sql` in your Supabase SQL Editor
   - Make sure the development server is running: `npm run dev`

### Test Scenario 1: Account Registration (New Accounting Firm)

#### Steps:
1. **Navigate to Login Page**:
   ```
   http://localhost:3000/login
   ```

2. **Switch to Registration**:
   - Click the "Registreren" tab on the login form
   - Form should expand to show additional fields

3. **Fill Registration Form**:
   ```
   Voornaam: Jan
   Achternaam: Janssen
   Naam boekhoudkantoor: Test Boekhoudkantoor
   Subdomeinnaam: testbedrijf
   E-mailadres: jan@testbedrijf.com
   Wachtwoord: password123
   Wachtwoord bevestigen: password123
   ```

4. **Submit Registration**:
   - Click "Account aanmaken"
   - Should see success message: "Account succesvol aangemaakt! U kunt nu inloggen."
   - Form should switch back to login tab
   - Form fields should be cleared

5. **Verify Database**:
   - Check Supabase dashboard → Authentication → Users
   - Should see new user with email `jan@testbedrijf.com`
   - Check Tables → accounts: Should see "Test Boekhoudkantoor" with subdomain "testbedrijf"
   - Check Tables → users: Should see user profile with role "accountant"

### Test Scenario 2: Login with New Account

#### Steps:
1. **Use Login Form**:
   ```
   E-mailadres: jan@testbedrijf.com
   Wachtwoord: password123
   ```

2. **Submit Login**:
   - Click "Inloggen"
   - Should redirect to `/dashboard`
   - Should see accountant dashboard with "Klanten Overzicht"

3. **Verify User Interface**:
   - Header should show company logo placeholder with "T" (first letter of Test Boekhoudkantoor)
   - User dropdown should show "Jan Janssen" and "Accountant" role
   - Primary color should be default blue (#1e40af)

4. **Test Logout**:
   - Click user avatar dropdown
   - Click "Uitloggen"
   - Should redirect to login page

### Test Scenario 3: Subdomain Access

#### Steps:
1. **Test Invalid Subdomain**:
   ```
   http://nonexistent.localhost:3000/login
   ```
   - Should show "Kantoor niet gevonden" message

2. **Test Valid Subdomain** (After registration):
   ```
   http://testbedrijf.localhost:3000/login
   ```
   - Should show login form with company branding
   - Header should show "Inloggen bij Test Boekhoudkantoor"

### Test Scenario 4: Error Handling

#### Registration Errors:
1. **Duplicate Subdomain**:
   - Try registering with same subdomain again
   - Should show: "Deze subdomeinnaam is al in gebruik"

2. **Password Mismatch**:
   - Enter different passwords in password fields
   - Should show: "Wachtwoorden komen niet overeen"

3. **Short Password**:
   - Enter password less than 6 characters
   - Should show: "Wachtwoord moet minimaal 6 karakters bevatten"

4. **Invalid Subdomain**:
   - Try subdomain with special characters: "test@kantoor"
   - Should show: "Subdomeinnaam mag alleen letters, cijfers en streepjes bevatten"

5. **Short Subdomain**:
   - Try subdomain with less than 3 characters: "ab"
   - Should show: "Subdomeinnaam moet minimaal 3 karakters bevatten"

#### Login Errors:
1. **Wrong Credentials**:
   - Try logging in with wrong password
   - Should show appropriate error message

2. **Non-existent User**:
   - Try logging in with email that doesn't exist
   - Should show appropriate error message

### Test Scenario 5: Multiple Accounts

#### Steps:
1. **Register Second Account**:
   ```
   Voornaam: Marie
   Achternaam: Pieters
   Naam boekhoudkantoor: Pieters & Co
   Subdomeinnaam: pieters
   E-mailadres: marie@pietersco.com
   Wachtwoord: password123
   Wachtwoord bevestigen: password123
   ```

2. **Verify Isolation**:
   - Each account should have separate data
   - Users should only see their own account's data
   - Subdomains should work independently

### Expected Database State After Testing

#### accounts table:
```
| id | name | subdomain | primary_color | contrast_color |
|----|------|-----------|---------------|----------------|
| ... | Demo Boekhoudkantoor | demo | #1e40af | #ffffff |
| ... | Test Boekhoudkantoor | testbedrijf | #1e40af | #ffffff |
| ... | Pieters & Co | pieters | #1e40af | #ffffff |
```

#### users table:
```
| id | email | first_name | last_name | role | account_id |
|----|-------|------------|-----------|------|------------|
| ... | jan@testbedrijf.com | Jan | Janssen | accountant | ... |
| ... | marie@pietersco.com | Marie | Pieters | accountant | ... |
```

### Troubleshooting Common Issues

1. **"Function create_account_and_user does not exist"**:
   - Ensure you've run the complete `supabase-schema.sql` script
   - Check Supabase SQL Editor for any errors

2. **RLS Policy Errors**:
   - Verify all RLS policies are enabled
   - Check user has correct account_id in users table

3. **Subdomain Not Working Locally**:
   - Use `testbedrijf.localhost:3000` for local testing
   - DNS setup only needed for production

4. **Email Confirmation Required**:
   - Check Supabase Auth settings
   - For testing, disable email confirmation in Supabase dashboard

### Performance Verification

- Registration should complete in < 2 seconds
- Login should complete in < 1 second
- Dashboard should load in < 3 seconds
- Form validation should be instant

### Security Verification

- ✅ Users can only see their own account data
- ✅ RLS policies prevent cross-account data access
- ✅ Authentication required for dashboard access
- ✅ Invalid subdomains show appropriate error
- ✅ Form validates all required fields
- ✅ Passwords are properly hashed by Supabase

---

## 🎯 Next Testing Phase

After basic registration/login works:

1. **Entrepreneur Registration** (Future feature):
   - Accountants should be able to add entrepreneur users
   - Entrepreneurs should only see their company data

2. **Financial Data** (Next sprint):
   - Add dummy financial data
   - Test KPI calculations
   - Verify chart rendering

3. **Branding Customization** (Next sprint):
   - Test logo upload
   - Test color customization
   - Verify whitelabeling across all pages

**🎉 If all tests pass, your Saldoo MVP registration and authentication flow is working perfectly!**
