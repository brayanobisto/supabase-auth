import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'app/server/routers/_app'

export const trpc = createTRPCReact<AppRouter>()
