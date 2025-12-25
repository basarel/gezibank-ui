'use client'

import 'intl-tel-input/styles'

import {
  Button,
  Container,
  Input,
  TextInput,
  PasswordInput,
  Checkbox,
  Title,
  Grid,
  Anchor,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { type Route } from 'next'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import IntlTelInput from 'intl-tel-input/react'
import clsx from 'clsx'
import { useMutation } from '@tanstack/react-query'
import { modals } from '@mantine/modals'

import { Image } from '@mantine/core'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

import {
  registerSchema,
  type RegisterSchemaTypes,
} from '@/app/(frontend)/auth/register/schema'
import { registerActions } from '@/app/(frontend)/auth/register/actions'
import { SocialLogin } from '@/app/(frontend)/auth/login/_components/social-login'

export const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
  })

  const handleMutate = useMutation({
    mutationFn: async (data: RegisterSchemaTypes) => {
      const actionResponse = await registerActions(
        data,
        window.location.origin + '/'
      )

      return actionResponse
    },
    onSuccess(query, variables) {
      if (!query?.data) {
        modals.open({
          title: 'Bir Sorun Var',
          children: (
            <div>
              <div>
                Girdiğiniz bilgilerle daha önce bir üyelik açılmış olabilir.
                Bilgilerinizi kontrol edin.
              </div>
              <div className='pt-4 text-center'>
                <Button
                  component={Link}
                  href={'/auth/login'}
                  onClick={() => {
                    modals.closeAll()
                  }}
                >
                  Veya Giriş Yapın
                </Button>
              </div>
            </div>
          ),
        })
      }

      if (query?.success) {
        modals.open({
          title: 'İşlem Başarılı',
          closeOnClickOutside: false,
          withCloseButton: false,
          children: (
            <div>
              <div>
                Kayıt işleminiz başarılı. Epostanıza gelen aktivasyon
                bağlantısını tıklayarak üyeliğinizi aktif edebilirsiniz.
              </div>
              <div className='pt-4 text-center'>
                <Button
                  component={Link}
                  href={'/auth/login'}
                  onClick={() => {
                    modals.closeAll()
                  }}
                >
                  Giriş Yap
                </Button>
              </div>
            </div>
          ),
          closeOnEscape: false,
        })
      }
    },
  })

  return (
    <Container className='mt-5 grid gap-5 rounded-lg p-0'>
      <form
        className='col-span-1 mx-2 rounded-lg border border-gray-200 p-5 shadow-xl md:col-span-2'
        onSubmit={form.handleSubmit((data) => {
          handleMutate.mutate(data)
        })}
      >
        <Title className='mb-15 text-start text-2xl'>GeziBank’a Üye Ol</Title>

        <div className='grid grid-cols-2 gap-3 gap-5 md:gap-5'>
          <div className='col-span-2 md:col-span-1'>
            <TextInput
              {...form.register('name')}
              label='Ad'
              size='lg'
              error={form.formState.errors.name?.message}
              autoComplete='given-name'
            />
          </div>
          <div className='col-span-2 md:col-span-1'>
            <TextInput
              {...form.register('surname')}
              size='lg'
              label='Soyad'
              error={form.formState.errors.surname?.message}
              autoComplete='family-name'
            />
          </div>
          <div className='col-span-2 md:col-span-1'>
            <TextInput
              size='lg'
              label='E-posta'
              type='email'
              {...form.register('email')}
              error={form.formState.errors.email?.message}
              autoComplete='username'
            />
          </div>
          <div className='col-span-2 md:col-span-1'>
            <Input.Wrapper>
              <Input.Label>Cep Telefonu</Input.Label>
              <div
                className='m_6c018570 mantine-Input-wrapper'
                data-variant='default'
              >
                <Controller
                  control={form.control}
                  name='phone'
                  render={({ field, fieldState }) => {
                    return (
                      <IntlTelInput
                        {...field}
                        usePreciseValidation
                        inputProps={{
                          className: clsx(
                            'm_8fb7ebe7 mantine-Input-input py-6',
                            {
                              'border-rose-500': !!fieldState.error?.message,
                            }
                          ),
                          id: field.name,
                          name: field.name,
                          type: 'tel',
                          autoComplete: 'phone',
                        }}
                        ref={(ref) => field.ref(ref?.getInput())}
                        onChangeNumber={field.onChange}
                        initOptions={{
                          strictMode: true,
                          containerClass: 'w-full',
                          separateDialCode: true,
                          initialCountry: 'auto',
                          i18n: {
                            tr: 'Türkiye',
                            searchPlaceholder: 'Ülke adı giriniz',
                          },
                          loadUtils: () =>
                            // @ts-expect-error watch for the package updates
                            import('intl-tel-input/build/js/utils.js'),
                          geoIpLookup: (callback) => {
                            fetch('https://ipapi.co/json')
                              .then((res) => res.json())
                              .then((data) => callback(data.country_code))
                              .catch(() => callback('tr'))
                          },
                        }}
                      />
                    )
                  }}
                />
              </div>
              {form.formState.errors.phone?.message && (
                <Input.Error className='pt-1'>
                  {form.formState.errors.phone?.message}
                </Input.Error>
              )}
            </Input.Wrapper>
          </div>
          <div className='col-span-2 md:col-span-1'>
            <PasswordInput
              {...form.register('password')}
              inputMode='text'
              label='Şifre'
              size='lg'
              error={form.formState.errors.password?.message}
              autoComplete='new-password'
            />
          </div>
          <div className='col-span-2 md:col-span-1'>
            <PasswordInput
              {...form.register('passwordRepeat')}
              inputMode='text'
              label='Şifre Tekrar'
              size='lg'
              error={form.formState.errors.passwordRepeat?.message}
              autoComplete='new-password'
            />
          </div>
          <div className='col-span-2'>
            <Checkbox
              label='Uçuş bilgilendirmeleri, fırsat ve kampanyalardan Rıza Metni kapsamında haberdar olmak istiyorum.'
              {...form.register('confirmAgreement')}
              error={form.formState.errors.confirmAgreement?.message}
            />
          </div>
          <div className='col-span-2'>
            <Checkbox
              label={
                <span>
                  Oturum açarak{' '}
                  <Link
                    target='_blank'
                    href={'/kullanim-sartlari-ve-genel-kosullar' as Route}
                    className='underline'
                  >
                    Kullanım Şartları ve Genel Koşullar
                  </Link>{' '}
                  ve{' '}
                  <Link
                    target='_blank'
                    href={'/gizlilik-ve-guvenlik' as Route}
                    className='underline'
                  >
                    Gizlilik Politikası
                  </Link>
                  nı okuduğumu ve kabul ettiğimi onaylıyorum.
                </span>
              }
              {...form.register('confirmKVKK')}
              error={form.formState.errors.confirmKVKK?.message}
            />
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
        <div className='my-4'>
          <Button
            type='submit'
            size='lg'
            fullWidth
            loading={handleMutate.isPending}
          >
            Üye Ol
          </Button>
          <div className='pt-5 text-center'>
            Zaten bir hesabınız mı var?{' '}
            <Anchor component={Link} href={'/auth/login'} fw={'bold'}>
              Giriş Yapın
            </Anchor>
          </div>
          <div className='mt-5 grid grid-cols-2 gap-3'>
            <SocialLogin />
          </div>
        </div>
      </form>
    </Container>
  )
}
