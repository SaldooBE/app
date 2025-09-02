-- Saldoo MVP Database Schema
-- Run this in your Supabase SQL Editor

-- Note: JWT secret is automatically configured by Supabase
-- No need to manually set app.jwt_secret in managed Supabase

-- Create custom types
CREATE TYPE user_role AS ENUM ('accountant', 'entrepreneur');
CREATE TYPE data_source AS ENUM ('dummy', 'exact_online');

-- Create accounts table (accounting firms)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#1e40af',
    contrast_color VARCHAR(7) DEFAULT '#ffffff',
    is_active BOOLEAN DEFAULT true
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
    company_id UUID,
    is_active BOOLEAN DEFAULT true
);

-- Create companies table (SME clients)
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
    exact_online_division VARCHAR(255),
    is_active BOOLEAN DEFAULT true
);

-- Add foreign key constraint to users.company_id
ALTER TABLE users ADD CONSTRAINT users_company_id_fkey 
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- Create financial_data table
CREATE TABLE IF NOT EXISTS financial_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    revenue DECIMAL(15,2) DEFAULT 0,
    expenses DECIMAL(15,2) DEFAULT 0,
    net_result DECIMAL(15,2) DEFAULT 0,
    gross_margin DECIMAL(15,2) DEFAULT 0,
    tax_estimate DECIMAL(15,2) DEFAULT 0,
    data_source data_source DEFAULT 'dummy',
    UNIQUE(company_id, year, month)
);

-- Create expense_categories table
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    category_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    UNIQUE(company_id, year, month, category_name)
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_financial_data_updated_at BEFORE UPDATE ON financial_data FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_expense_categories_updated_at BEFORE UPDATE ON expense_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accounts table
CREATE POLICY "Accounts are viewable by users within the same account" ON accounts
    FOR SELECT USING (
        id IN (
            SELECT account_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Accountants can update their own account" ON accounts
    FOR UPDATE USING (
        id IN (
            SELECT account_id FROM users 
            WHERE id = auth.uid() AND role = 'accountant'
        )
    );

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can view other users in their account" ON users
    FOR SELECT USING (
        account_id IN (
            SELECT account_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- RLS Policies for companies table
CREATE POLICY "Companies are viewable by users within the same account" ON companies
    FOR SELECT USING (
        account_id IN (
            SELECT account_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Entrepreneurs can only see their own company" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND role = 'entrepreneur'
        )
    );

-- RLS Policies for financial_data table
CREATE POLICY "Financial data is viewable by users within the same account" ON financial_data
    FOR SELECT USING (
        company_id IN (
            SELECT c.id FROM companies c
            INNER JOIN users u ON u.account_id = c.account_id
            WHERE u.id = auth.uid()
        )
    );

CREATE POLICY "Entrepreneurs can only see their own company's financial data" ON financial_data
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND role = 'entrepreneur'
        )
    );

-- RLS Policies for expense_categories table
CREATE POLICY "Expense categories are viewable by users within the same account" ON expense_categories
    FOR SELECT USING (
        company_id IN (
            SELECT c.id FROM companies c
            INNER JOIN users u ON u.account_id = c.account_id
            WHERE u.id = auth.uid()
        )
    );

CREATE POLICY "Entrepreneurs can only see their own company's expense categories" ON expense_categories
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND role = 'entrepreneur'
        )
    );

-- RLS Policies for faqs table
CREATE POLICY "FAQs are viewable by users within the same account" ON faqs
    FOR SELECT USING (
        account_id IN (
            SELECT account_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Accountants can manage FAQs for their account" ON faqs
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM users 
            WHERE id = auth.uid() AND role = 'accountant'
        )
    );

-- Database function to create account and user profile atomically
CREATE OR REPLACE FUNCTION create_account_and_user(
  user_id UUID,
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  account_name TEXT,
  account_subdomain TEXT
) RETURNS UUID AS $$
DECLARE
  new_account_id UUID;
BEGIN
  -- Create the account first
  INSERT INTO accounts (name, subdomain, primary_color, contrast_color, is_active)
  VALUES (account_name, account_subdomain, '#1e40af', '#ffffff', true)
  RETURNING id INTO new_account_id;
  
  -- Create the user profile
  INSERT INTO users (id, email, first_name, last_name, role, account_id, is_active)
  VALUES (user_id, user_email, user_first_name, user_last_name, 'accountant', new_account_id, true);
  
  RETURN new_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if subdomain is available
CREATE OR REPLACE FUNCTION is_subdomain_available(subdomain_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM accounts WHERE subdomain = LOWER(subdomain_name)
  );
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for testing
-- Sample accounting firm
INSERT INTO accounts (name, subdomain, primary_color, contrast_color) 
VALUES ('Demo Boekhoudkantoor', 'demo', '#1e40af', '#ffffff');

-- You can add more sample data here after creating your actual account
