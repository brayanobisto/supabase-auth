import { Button, Paragraph, Spinner, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import React, { useEffect } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { trpc } from 'app/utils/trpc'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
const { useParam } = createParam<{ id: string }>()

export function UserDetailScreen() {
  const [id] = useParam('id')
  const link = useLink({
    href: '/',
  })
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const session = useSession()
  const { data, isLoading, isSuccess, error, refetch } =
    trpc.getUser.useQuery(/* {
    session: {
      access_token: session?.access_token ?? '',
      refresh_token: session?.refresh_token ?? '',
    },
  } */)

  useEffect(() => {}, [])

  if (isLoading) return <Spinner />

  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="700">{`User ID: ${id}`}</Paragraph>
      <Paragraph ta="center" fow="700">
        {isSuccess ? JSON.stringify(data?.user, null, 2) : error.message}
      </Paragraph>

      <Button {...link} icon={ChevronLeft}>
        Go Home
      </Button>
    </YStack>
  )
}
