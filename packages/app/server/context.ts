import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function createContext({ req, res }: CreateNextContextOptions) {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  })

  return { req, res, supabaseServerClient }
}

export type Context = inferAsyncReturnType<typeof createContext>
