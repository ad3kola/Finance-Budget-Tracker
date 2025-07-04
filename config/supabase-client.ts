import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.SUPABASE_PROJECT_URL as string
const supabaseKey = process.env.SUPABASE_API_KEY as string

export const supabase =  createClient(supabaseURL, supabaseKey)