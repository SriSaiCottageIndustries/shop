
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ytygnlarqqenpqomtrkf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0eWdubGFycXFlbnBxb210cmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzI5NjQsImV4cCI6MjA4MTYwODk2NH0.9Xeqgqr376Os3Q9r-B5KM0bw8el1SLY579tx6BvAuwo'

export const supabase = createClient(supabaseUrl, supabaseKey)
