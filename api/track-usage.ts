import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY as string;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);
    
    // Verify user from token safely on backend
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const column = type === 'video' ? 'videos_used' : 'downloads_used';

    // Increment usage in database
    const { data, error: updateError } = await supabaseAdmin.rpc('increment_usage', { 
      user_id: user.id,
      column_name: column 
    });

    // Fallback if RPC doesn't exist yet: manual increment
    if (updateError) {
      console.warn('RPC increment_usage failed, falling back to manual update:', updateError);
      
      const { data: userData, error: fetchError } = await supabaseAdmin
        .from('users')
        .select(column)
        .eq('id', user.id)
        .single();
        
      if (fetchError) throw fetchError;

      const currentUsage = (userData as any)[column] || 0;

      const { error: manualUpdateError } = await supabaseAdmin
        .from('users')
        .update({ [column]: currentUsage + 1 })
        .eq('id', user.id);

      if (manualUpdateError) throw manualUpdateError;
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error tracking usage:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
