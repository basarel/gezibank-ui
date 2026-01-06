'use client'

import {
  Button,
  TextInput,
  Textarea,
  Text,
  Stack,
  Box,
  Modal,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceRequest } from '@/network'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { MdError } from 'react-icons/md'

const schema = z.object({
  name: z.string().nonempty().min(3),
  lastName: z.string().nonempty().min(3),
  email: z.string().email(),
  gsm: z.string().nonempty(),
  subject: z.string().nonempty(),
})
type SchemaType = z.infer<typeof schema>
type IProps = {
  moduleName: string
}
function NotFoundForm({ moduleName }: IProps) {
  const formAction = useForm({
    resolver: zodResolver(schema),
  })

  function handleSubmit(data: SchemaType) {
    submitMutation.mutate(data)
  }
  const submitMutation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/callForm',
          method: 'Post',
          data,
        },
      })
      return response
    },
    onSuccess: (response) => {
      if (response?.success) {
        notifications.show({
          title: 'Başarılı',
          message:
            'Talebiniz başarıyla alınmıştır. Yetkililerimiz en kısa zamanda size ulaşacaktır.',
          color: 'green',
          autoClose: 3000,
          top: 0,
          position: 'top-right',
        })
        formAction.reset()
        closeModal()
      } else {
        notifications.show({
          title: 'Hata',
          message: 'Lütfen tekrar deneyiniz.',
          color: 'red',
        })
      }
    },
    onError: (error) => {
      console.error('Form submission error:', error)
      notifications.show({
        title: 'Hata',
        message: 'Bir hata oluştu. Lütfen tekrar deneyiniz.',
        color: 'red',
      })
    },
  })
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false)

  return (
    <Box className='rounded-lg border border-gray-200 bg-blue-50 p-6 md:p-8'>
      <Stack gap='lg'>
        <Box className='text-center'>
          <MdError className='mx-auto mb-4 text-red-800' size={48} />

          <Text fw={500} className='mb-4 text-base md:text-xl'>
            Aradığınız kriterlere uygun sonuç bulunamamıştır
          </Text>
        </Box>
        <Button
          className='mx-auto flex w-50 justify-center rounded bg-blue-600 text-sm font-semibold text-white hover:bg-blue-800'
          onClick={openModal}
        >
          Telefonla Satış Talep Et
        </Button>

        <Modal
          withCloseButton
          opened={opened}
          onClose={closeModal}
          size={'xl'}
          title={'TELEFONLA SATIŞ / TALEP ET'}
        >
          <Text size='md' c='dark' className='text-center leading-relaxed'>
            {moduleName} Sonuçları hakkında ayrıntılı bilgi ve rezervasyon için{' '}
            <Text
              component='a'
              href='tel:+908508780400'
              fw={700}
              c='blue'
              className='cursor-pointer text-lg hover:underline'
            >
              0850 840 01 51
            </Text>{' '}
            nolu Müşteri Hizmetlerini arayabilir,{' '}
            <Text
              component='a'
              href='mailto:info@gezibank.com'
              fw={700}
              c='blue'
              className='cursor-pointer text-lg hover:underline'
            >
              info@gezibank.com{' '}
            </Text>{' '}
            adresine mail atabilir ya da aşağıdaki formu doldurabilirsiniz.
            Yetkililerimiz en kısa zamanda size ulaşacaktır.
          </Text>
          <form onSubmit={formAction.handleSubmit(handleSubmit)}>
            <Stack gap='md' className='mt-5'>
              <div className='flex flex-col gap-4 md:flex-row'>
                <TextInput
                  label='Adınız'
                  placeholder='Adınızı girin'
                  {...formAction.register('name')}
                  error={formAction.formState.errors.name?.message}
                  className='flex-1'
                />
                <TextInput
                  label='Soyadınız'
                  placeholder='Soyadınızı girin'
                  {...formAction.register('lastName')}
                  error={formAction.formState.errors.lastName?.message}
                  className='flex-1'
                />
              </div>
              <div className='flex flex-col gap-4 md:flex-row'>
                <TextInput
                  label='E-posta Adresiniz'
                  type='email'
                  placeholder='email@email.com'
                  {...formAction.register('email')}
                  error={formAction.formState.errors.email?.message}
                  className='flex-1'
                />
                <TextInput
                  inputMode='numeric'
                  type='tel'
                  label='Telefon Numaranız'
                  placeholder='+90_________'
                  {...formAction.register('gsm')}
                  error={formAction.formState.errors.gsm?.message}
                  className='flex-1'
                />
              </div>

              <Textarea
                label='Mesajınızı Giriniz'
                placeholder='Rezervasyon talebiniz hakkında detay verebilirsiniz...'
                {...formAction.register('subject')}
                error={formAction.formState.errors.subject?.message}
                minRows={13}
              />

              <Button
                type='submit'
                size='lg'
                loading={submitMutation.isPending}
                className='text-md w-full rounded bg-blue-800 font-semibold text-white hover:bg-blue-600'
              >
                TELEFONLA SATIŞ / TALEP ET
              </Button>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Box>
  )
}
export { NotFoundForm }
