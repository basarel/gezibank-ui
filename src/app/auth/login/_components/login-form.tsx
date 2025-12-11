'use client'

import { Controller, useForm } from 'react-hook-form'
import { z } from '@/libs/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Anchor,
  Button,
  Divider,
  PasswordInput,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { signIn, useSession } from 'next-auth/react'
import { Link, useTransitionRouter } from 'next-view-transitions'
import { serviceRequest } from '@/network'
import { modals } from '@mantine/modals'
import { useMutation } from '@tanstack/react-query'
import { Route } from 'next'
import { FaFacebook } from 'react-icons/fa'
import { SocialLogin } from './social-login'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  honeypot: z.null(),
})

type LoginSchemaType = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const session = useSession()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  })
  const router = useTransitionRouter()

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (formData: LoginSchemaType) => {
      const response = await serviceRequest<{
        name: string
        returnUrl: null
        searchToken: null
        sessionToken: null
        userAuthenticationToken: string
      }>({
        axiosOptions: {
          url: 'api/account/login',
          method: 'post',
          withCredentials: true,
          data: {
            loginForm: {
              email: formData.email,
              password: formData.password,
            },
          },
        },
      })

      if (!response?.success) {
        throw new Error('User not found')
      }

      return response
    },
    onSuccess: async (query) => {
      await signIn('credentials', {
        name: query.data?.name,
        redirect: true,
      })

      modals.closeAll()
    },
  })

  if (session.status === 'authenticated') router.replace('/')

  return (
    <form
      className='flex flex-col gap-4'
      onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
    >
      {loginMutation.isError && (
        <Alert color='red' mb={'lg'}>
          Kullanici bulunamadi
        </Alert>
      )}
      <Controller
        control={form.control}
        name='email'
        defaultValue=''
        render={({ field, fieldState }) => {
          return (
            <TextInput
              {...field}
              size='md'
              label='E-posta Adresi'
              error={fieldState.error?.message}
              autoComplete='email'
            />
          )
        }}
      />
      <Controller
        control={form.control}
        name='password'
        defaultValue=''
        render={({ field, fieldState }) => {
          return (
            <PasswordInput
              {...field}
              size='md'
              label='Şifre'
              error={fieldState.error?.message}
              autoComplete='current-password'
            />
          )
        }}
      />
      <Controller
        control={form.control}
        name='honeypot'
        defaultValue={null}
        render={({ field }) => {
          return (
            <TextInput
              {...field}
              aria-label='honeypot'
              value={field.value ?? ''}
            />
          )
        }}
      />
      <div className='flex flex-col justify-center'>
        <Button type='submit' size='md' loading={loginMutation.isPending}>
          Giriş Yap
        </Button>
      </div>
      <div className='text-center'>
        <Anchor
          component={Link}
          href={'/auth/forgot-password' as Route}
          onClick={modals.closeAll}
        >
          Şifremi unuttum
        </Anchor>
      </div>
      <div className='text-center'>
        <Anchor
          component={Link}
          href={'/auth/resend-confirm-email' as Route}
          onClick={modals.closeAll}
        >
          Tekrar E-posta Aktivasyonu Yapın!
        </Anchor>
      </div>
      <Divider label='veya' />
      <div className='grid min-w-1/6 gap-3'>
        <SocialLogin />
      </div>
      <div className='text-center'>
        Üyeliğin yok mu?{' '}
        <Anchor
          className='font-bold'
          component={Link}
          href={'/auth/register'}
          onClick={modals.closeAll}
        >
          Üye Ol
        </Anchor>
      </div>
    </form>
  )
}
