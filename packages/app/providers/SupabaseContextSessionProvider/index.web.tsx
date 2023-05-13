import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, type Session } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import type { SolitoAppProps } from 'solito'

export const SupabaseContextSessionProvider = ({
  Component,
  pageProps,
}: SolitoAppProps<{
  initialSession: Session
}>) => {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
