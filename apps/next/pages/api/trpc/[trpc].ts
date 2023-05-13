import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from 'app/server/routers/_app'
import { createContext } from 'app/server/context'

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error /* type, path, input, ctx, req  */ }) {
    // TODO: Implement Me
    console.log(error)
  },
})
