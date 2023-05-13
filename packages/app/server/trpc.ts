import { initTRPC } from '@trpc/server'
import { Context } from './context'

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create()

// Base router and procedure helpers
export const middleware = t.middleware

const setSession = middleware(async ({ ctx, next }) => {
  const access_token = ctx.req.headers['access_token']?.toString() ?? ''
  const refresh_token = ctx.req.headers['access_token']?.toString() ?? ''

  if (access_token && refresh_token) {
    await ctx.supabaseServerClient.auth.setSession({
      access_token,
      refresh_token,
    })
  }

  return next()
})

export const router = t.router
export const procedure = t.procedure.use(setSession)
