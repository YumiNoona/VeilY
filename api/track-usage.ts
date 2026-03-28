import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

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
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user from token safely on backend
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const column = type === 'video' ? 'videos_used' : 'downloads_used';

    // Increment usage atomically via RPC
    const { error: rpcError } = await supabaseAdmin.rpc('increment_usage', { 
      user_id: user.id,
      column_name: column 
    });

    if (rpcError) {
      console.error('RPC increment_usage failed:', rpcError);
      throw rpcError;
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error tracking usage:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
