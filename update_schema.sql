-- Run this in your Supabase SQL Editor

-- 1. Add variants column (if missing)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'variants') THEN 
        ALTER TABLE public.products ADD COLUMN variants JSONB; 
    END IF;
END $$;

-- 2. Add badge_color column (Important for detailed customization)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'badge_color') THEN 
        ALTER TABLE public.products ADD COLUMN badge_color TEXT; 
    END IF;
END $$;

-- 3. Ensure other columns exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'original_price') THEN 
        ALTER TABLE public.products ADD COLUMN original_price NUMERIC; 
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tagline') THEN 
        ALTER TABLE public.products ADD COLUMN tagline TEXT; 
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'description') THEN 
        ALTER TABLE public.products ADD COLUMN description TEXT; 
    END IF;
END $$;
