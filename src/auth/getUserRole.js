import { supabase } from '../supabase/client';

export async function getUserRole(email) {
  try {
    // Step 1: Get the account and role_id directly with case-insensitive email search
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('email, role_id, is_active')
      .ilike('email', email) // Use ilike for case-insensitive matching instead of eq
      .eq('is_active', true)
      .order('created_at', { ascending: false }) // Get the most recent account if duplicates exist
      .limit(1);

    if (accountError) {
      console.error('❌ Account fetch error:', accountError.message);
      return null;
    }

    if (!accountData || accountData.length === 0) {
      console.error('❌ No account found for:', email);
      return null;
    }

    console.log('✅ Account found:', accountData[0]);

    // Step 2: Get the role name separately
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('role_name')
      .eq('role_id', accountData[0].role_id)
      .single();

    if (roleError) {
      console.error('❌ Role fetch error:', roleError.message);
      return null;
    }

    if (!roleData) {
      console.error('❌ No role found for role_id:', accountData[0].role_id);
      return null;
    }

    console.log('✅ Role found:', roleData.role_name);
    return roleData.role_name;
    
  } catch (error) {
    console.error('❌ Unexpected error in getUserRole:', error);
    return null;
  }
}