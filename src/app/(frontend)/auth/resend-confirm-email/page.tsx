'use client'

import { Alert, Button, Container, TextInput, Title } from '@mantine/core'
import { modals } from '@mantine/modals'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from '@/libs/zod'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { useTransitionRouter } from 'next-view-transitions'

const schema = z.object({
  email: z.string().email(),
  honeypot: z.null(),
})

type SchemaType = z.infer<typeof schema>
export default function ResendConfirmEmail() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/reSendAccountConfirmationEmail',
          data: {
            ...data,
            siteURL: window.location.origin,
          },
          method: 'post',
        },
      })

      return response
    },
    mutationKey: ['send-confirm-email'],
  })
  const router = useTransitionRouter()
  const handleSubmit = (data: SchemaType) => {
    mutation.mutate(data, {
      onSuccess(data) {
        if (data?.success) {
          modals.open({
            title: 'Mail Gönderildi',
            closeOnEscape: false,
            closeOnClickOutside: false,
            withCloseButton: false,
            children: (
              <div className='text-center'>
                <div className='pb-3'>
                  Aktivasyon <b>{form.getValues('email')}</b> adresine
                  gönderildi.
                </div>
                <Button
                  onClick={() => {
                    modals.closeAll()
                    router.push('/')
                  }}
                >
                  Ana Sayfa
                </Button>
              </div>
            ),
          })
        }
      },
    })
  }

  return (
    <Container maw={500} my={'lg'} p='lg' className='border text-center'>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex flex-col gap-5'>
          <Title fz={'h3'}>Aktivasyon E-posta Gönderimi</Title>
          <div>Kayıt olduğunuz E-posta adresinizi giriniz.</div>
          <Controller
            control={form.control}
            name='email'
            defaultValue=''
            render={({ field, fieldState }) => {
              return (
                <TextInput
                  {...field}
                  type='email'
                  name='email'
                  label='E-posta Adresinizi girin'
                  placeholder='E-posta Adresinizi girin'
                  error={fieldState.error?.message}
                />
              )
            }}
          />

          {mutation.data && !mutation.data?.success && (
            <div>
              <Alert color='red'>
                {form.getValues('email')} ile bir kayıt bulunamadı.
              </Alert>
            </div>
          )}
          <div>
            <Button type='submit' loading={mutation.isPending}>
              Gönder
            </Button>
          </div>
        </div>
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
      </form>
    </Container>
  )
}
