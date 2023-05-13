import { z } from 'zod'
import { procedure, router } from '../trpc'

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: opts.input.text,
      }
    }),
  signUp: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data: signUpData, error: signUpError } = await ctx.supabaseServerClient.auth.signUp({
        email: input.email,
        password: input.password,
      })

      if (!signUpError) {
        ctx.supabaseServerClient.auth.setSession({
          access_token: signUpData.session?.access_token!,
          refresh_token: signUpData.session?.refresh_token!,
        })

        return signUpData
      }

      const { data: signInData, error: signInError } =
        await ctx.supabaseServerClient.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        })

      if (signInError) throw signInError

      return signInData
    }),
  getUser: procedure
    .input(
      z
        .object({
          session: z.object({
            access_token: z.string(),
            refresh_token: z.string(),
          }),
        })
        .optional()
    )
    .query(async ({ ctx }) => {
      const { data, error: getUserError } = await ctx.supabaseServerClient.auth.getUser()

      if (getUserError) throw getUserError

      return data
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
