import {
  Input,
  Button,
  H1,
  Separator,
  Sheet,
  XStack,
  YStack,
  useToastController,
  Spinner,
  Form,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useState, useEffect } from 'react'
import { useLink } from 'solito/link'
import { trpc } from 'app/utils/trpc'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export function HomeScreen() {
  const hello = trpc.hello.useQuery({ text: 'Brayan' })
  const { mutate, data, isLoading, isSuccess, isError, error } = trpc.signUp.useMutation()
  const linkProps = useLink({
    href: '/user/nate',
  })
  const supabaseClient = useSupabaseClient()
  const user = useUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // console.log(supabaseClient)
  // console.log(user)

  // TODO: Test it to see if it is necessary
  useEffect(() => {
    if (data?.session) {
      supabaseClient.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
    }
  }, [data?.session])

  const signUp = () => {
    if (isLoading) return
    mutate({ email, password })
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    console.log(error?.message)
  }

  if (!hello.data?.greeting) {
    return <Spinner />
  }

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4" maw={600}>
        <H1 ta="center">Welcome to Tamagui {hello?.data?.greeting}.</H1>
        <Separator />
        {!user && (
          <Form onSubmit={signUp} space={16}>
            <Input value={email} onChangeText={setEmail} />
            <Input value={password} onChangeText={setPassword} />

            <Form.Trigger asChild>
              <Button>Sign Up</Button>
            </Form.Trigger>
          </Form>
        )}
      </YStack>

      <XStack space={4}>
        {user && <Button onPress={signOut}>Sign Out</Button>}
        <Button {...linkProps}>Link to user</Button>
      </XStack>

      <SheetDemo />
    </YStack>
  )
}

function SheetDemo() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const toast = useToastController()

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame ai="center" jc="center">
          <Sheet.Handle />
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
