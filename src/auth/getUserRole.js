import { supabase } from '../supabase/client';

export async function getUserRole(email) {
  try {
    // Step 1: Get the account and role_id directly
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('email, role_id, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (accountError) {
      console.error('❌ Account fetch error:', accountError.message);
      return null;
    }

    if (!accountData) {
      console.error('❌ No account found for:', email);
      return null;
    }

    console.log('✅ Account found:', accountData);

    // Step 2: Get the role name separately
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('role_name')
      .eq('role_id', accountData.role_id)
      .single();

    if (roleError) {
      console.error('❌ Role fetch error:', roleError.message);
      return null;
    }

    if (!roleData) {
      console.error('❌ No role found for role_id:', accountData.role_id);
      return null;
    }

    console.log('✅ Role found:', roleData.role_name);
    return roleData.role_name;
    
  } catch (error) {
    console.error('❌ Unexpected error in getUserRole:', error);
    return null;
  }
}