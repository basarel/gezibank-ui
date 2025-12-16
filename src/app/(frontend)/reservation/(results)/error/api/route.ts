import { redirect } from 'next/navigation'
import { resend } from '@/libs/resend'

import { type NextRequest } from 'next/server'
import PaymentErrorMail from '@/emails/payment-error'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const mdstatus = formData.get('mdstatus')
  const ErrorCode = formData.get('ErrorCode')
  const ProcReturnCode = formData.get('ProcReturnCode')
  const status = mdstatus || ErrorCode || -1
  const message = encodeURIComponent(
    formData.get('responseMessage')?.toString() || ''
  )

  try {
    resend().emails.send({
      from: process.env.EMAIL_FROM,
      to: 'islemsonuc@paraflytravel.com',
      subject: 'Odeme Hatası',
      react: PaymentErrorMail({
        code: JSON.stringify(Object.fromEntries(formData)),
      }),
    })
  } catch (error) {
    console.log('resend has some errors, ', error)
  }

  return redirect(
    `/reservation/error?status=${status}&message=${message}&ProcReturnCode=${ProcReturnCode}`
  )
}
