const noop = () => {};

const mockFrom = (table: string) => ({
  select: () => mockQueryBuilder(table),
  insert: () => mockQueryBuilder(table),
  update: () => mockQueryBuilder(table),
  upsert: () => mockQueryBuilder(table),
  delete: () => mockQueryBuilder(table),
  eq: () => mockQueryBuilder(table),
  single: () => mockQueryBuilder(table),
});

const mockQueryBuilder = (table: string): any => ({
  data: table === 'users' ? { plan: 'premium', downloads_used: 0, videos_used: 0, ai_fills_used: 0, last_ai_fill_date: null, avatar_url: null, full_name: 'Local User' } : null,
  error: null,
  eq: () => mockQueryBuilder(table),
  single: () => mockQueryBuilder(table),
  select: () => mockQueryBuilder(table),
  order: () => mockQueryBuilder(table),
  limit: () => mockQueryBuilder(table),
  maybeSingle: () => mockQueryBuilder(table),
  then: (resolve: any) => Promise.resolve(resolve({ data: null, error: null })),
});

const mockUser = {
  id: 'local-user',
  email: 'local@veily.app',
  user_metadata: { full_name: 'Local User', avatar_url: null },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: mockUser, access_token: '', refresh_token: '' } }, error: null }),
    signInWithPassword: async () => ({ data: { user: mockUser, session: null }, error: null }),
    signInWithOtp: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: { user: mockUser, session: null }, error: null }),
    verifyOtp: async () => ({ data: { user: mockUser, session: null }, error: null }),
    signOut: async () => { noop(); return { error: null }; },
    updateUser: async (attrs: any) => ({ data: { user: { ...mockUser, ...attrs } }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: noop } } }),
    resend: async () => ({ data: null, error: null }),
    getUser: async () => ({ data: { user: mockUser }, error: null }),
  },
  from: mockFrom,
  rpc: async () => ({ data: 0, error: null }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: { message: 'Storage not available in local mode' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};
