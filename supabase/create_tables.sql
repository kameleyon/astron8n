-- Create subscription_history table
CREATE TABLE IF NOT EXISTS public.subscription_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    plan_type VARCHAR(50) NOT NULL DEFAULT 'premium',
    next_payment_date TIMESTAMP WITH TIME ZONE,
    trial_end_date TIMESTAMP WITH TIME ZONE,
    is_trial BOOLEAN DEFAULT false,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for subscription_history
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'subscription_history'
        AND policyname = 'Users can view their own subscription history'
    ) THEN
        CREATE POLICY "Users can view their own subscription history"
            ON public.subscription_history
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'subscription_history'
        AND policyname = 'Users can insert their own subscription history'
    ) THEN
        CREATE POLICY "Users can insert their own subscription history"
            ON public.subscription_history
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'subscription_history'
        AND policyname = 'Users can update their own subscription history'
    ) THEN
        CREATE POLICY "Users can update their own subscription history"
            ON public.subscription_history
            FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_method_id VARCHAR(255),
    brand VARCHAR(50) NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    exp_month INTEGER NOT NULL,
    exp_year INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'payment_methods'
        AND policyname = 'Users can view their own payment methods'
    ) THEN
        CREATE POLICY "Users can view their own payment methods"
            ON public.payment_methods
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'payment_methods'
        AND policyname = 'Users can insert their own payment methods'
    ) THEN
        CREATE POLICY "Users can insert their own payment methods"
            ON public.payment_methods
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'payment_methods'
        AND policyname = 'Users can update their own payment methods'
    ) THEN
        CREATE POLICY "Users can update their own payment methods"
            ON public.payment_methods
            FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'payment_methods'
        AND policyname = 'Users can delete their own payment methods'
    ) THEN
        CREATE POLICY "Users can delete their own payment methods"
            ON public.payment_methods
            FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create billing_activities table
CREATE TABLE IF NOT EXISTS public.billing_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    tokens INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for billing_activities
ALTER TABLE public.billing_activities ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'billing_activities'
        AND policyname = 'Users can view their own billing activities'
    ) THEN
        CREATE POLICY "Users can view their own billing activities"
            ON public.billing_activities
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'billing_activities'
        AND policyname = 'Users can insert their own billing activities'
    ) THEN
        CREATE POLICY "Users can insert their own billing activities"
            ON public.billing_activities
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Handle api_usage table
DO $$
DECLARE
    table_exists BOOLEAN;
    column_exists BOOLEAN;
BEGIN
    -- Check if api_usage table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'api_usage'
    ) INTO table_exists;

    IF NOT table_exists THEN
        -- Create api_usage table if it doesn't exist
        CREATE TABLE public.api_usage (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            endpoint VARCHAR(255),
            method VARCHAR(10),
            status_code INTEGER,
            response_time INTEGER,
            cost DECIMAL(10, 2) DEFAULT 0,
            tokens_used INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Check if user_id column exists
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'api_usage' 
            AND column_name = 'user_id'
        ) INTO column_exists;

        -- Add user_id column if it doesn't exist
        IF NOT column_exists THEN
            ALTER TABLE public.api_usage ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
    END IF;

    -- Enable RLS on api_usage
    ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

    -- Create policies only if user_id column exists
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'api_usage' 
        AND column_name = 'user_id'
    ) INTO column_exists;

    IF column_exists THEN
        -- Add view policy if it doesn't exist
        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE tablename = 'api_usage'
            AND policyname = 'Users can view their own api usage'
        ) THEN
            CREATE POLICY "Users can view their own api usage"
                ON public.api_usage
                FOR SELECT
                USING (auth.uid() = user_id);
        END IF;

        -- Add insert policy if it doesn't exist
        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE tablename = 'api_usage'
            AND policyname = 'Users can insert their own api usage'
        ) THEN
            CREATE POLICY "Users can insert their own api usage"
                ON public.api_usage
                FOR INSERT
                WITH CHECK (auth.uid() = user_id);
        END IF;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON public.subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_activities_user_id ON public.billing_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON public.api_usage(user_id);
