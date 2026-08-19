import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://vqjhhhxrxwgamowlruuz.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_Z_6XZreRs_IvWJSbSKkmTg_FZFfYZrV';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Warning: SUPABASE_URL or SUPABASE_ANON_KEY environment variables missing.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
