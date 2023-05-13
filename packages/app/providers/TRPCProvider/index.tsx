import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'
import { trpc } from 'app/utils/trpc'
import * as SecureStore from 'expo-secure-store'
import { NEXT_API_URL } from '@env'

export const TRPCProvider = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: NEXT_API_URL,
          // You can pass any HTTP headers you wish here
          async headers() {
            const supabaseStorage = JSON.parse(
              (await SecureStore.getItemAsync('supabase-storage')) ?? '{}'
            )

            const access_token = supabaseStorage['access_token'] ?? ''
            const refresh_token = supabaseStorage['refresh_token'] ?? ''

            return {
              access_token,
              refresh_token,
            }
          },
        }),
      ],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
