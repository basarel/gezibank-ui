'use client'
import {
  Button,
  Grid,
  GridCol,
  Modal,
  NativeSelect,
  TextInput,
} from '@mantine/core'
import { z } from '@/libs/zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { useState } from 'react'
import { MdOutlineCheckCircle } from 'react-icons/md'
const schema = z.object({
  name: z.string().nonempty().min(3),
  lastName: z.string().nonempty().min(3),
  email: z.string().email(),
  gsm: z.string().nonempty(),
  subject: z.string().nonempty(),
})
type SchemaType = z.infer<typeof schema>
function CallForm() {
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
          method: 'POST',
          data,
        },
      })
      return response
    },
    onSuccess: (response) => {
      if (response?.success) {
        setModalOpened(true)
        formAction.reset()
      }
    },
  })
  const [modalOpened, setModalOpened] = useState(false)
  return (
    <form onSubmit={formAction.handleSubmit(handleSubmit)}>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        size={'lg'}
        withCloseButton
        title={
          <div className='flex items-center gap-3 text-xl'>
            <div>
              <MdOutlineCheckCircle size={32} className='text-blue-800' />
            </div>
            Talebiniz Alınmıştır
          </div>
        }
      >
        <div className='py-5'>
          Müşteri temsilcilerimiz talebinize en uygun çözüm önerilerini sunmak
          için <span className='font-medium text-blue-800'>09:00-18:00</span>{' '}
          saatleri arasında{' '}
          <a
            href='tel:08508780400'
            className='font-medium text-blue-800 underline hover:no-underline'
          >
            0850 840 01 51
          </a>{' '}
          numaralı telefondan sizinle iletişime geçecektir.
        </div>
      </Modal>
      <Grid>
        <GridCol span={12}>
          <NativeSelect
            size='md'
            label='Konu'
            data={[
              { label: 'Seçim Yapınız', value: '' },
              'Grup Rezervasyon Talebi',
              'Rezervasyon Sonrası Evrak Talebi',
              'İptal/İade veya Değişiklik Talebi',
              'Diğer',
            ]}
            error={formAction.formState.errors.subject?.message}
            {...formAction.register('subject')}
          />
        </GridCol>
        <GridCol span={6}>
          <TextInput
            label='Ad'
            placeholder='Ad'
            {...formAction.register('name')}
            error={formAction.formState.errors.name?.message}
          />
        </GridCol>
        <GridCol span={6}>
          <TextInput
            label='Soyad'
            placeholder='Soyad'
            {...formAction.register('lastName')}
            error={formAction.formState.errors.lastName?.message}
          />
        </GridCol>

        <GridCol span={12}>
          <TextInput
            type='tel'
            inputMode='numeric'
            label='Telefon Numarası'
            placeholder='+90_________'
            {...formAction.register('gsm')}
            error={formAction.formState.errors.gsm?.message}
          />
        </GridCol>
        <GridCol span={12}>
          <TextInput
            type='email'
            label='E-Posta'
            placeholder='mailto@example.com'
            {...formAction.register('email')}
            error={formAction.formState.errors.email?.message}
          />
        </GridCol>

        <GridCol span={12} className='flex flex-col'>
          <Button type='submit' size='md' radius={'md'} variant='filled'>
            Gönder
          </Button>
        </GridCol>
      </Grid>
    </form>
  )
}
export { CallForm }
