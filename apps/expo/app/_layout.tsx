import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Provider } from 'app/providers'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'

import { SessionContextProvider, type Session } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    console.log('getItem', key)
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    console.log('setItem', key, value)
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    console.log('removeItem', key)
    SecureStore.deleteItemAsync(key)
  },
}

const createSupabaseClient = () =>
  // TODO: Move this to a ENV file
  createClient(
    'http://192.168.244.229:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    {
      auth: {
        storage: ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        storageKey: 'supabase-storage',
      },
    }
  )

export default function HomeLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })
  const scheme = useColorScheme()
  const [supabaseClient] = useState(() => createSupabaseClient())
  const [initialSession, setInitialSession] = useState<Session | null>(null)

  // TODO: This seems to be unnecessary
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => setInitialSession(session))
  }, [])

  if (!loaded) {
    return null
  }
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <Provider>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack />
        </ThemeProvider>
      </Provider>
    </SessionContextProvider>
  )
}
