import { Alert, Container } from '@mantine/core'
import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'

export default async function AuthErrorPage() {
  const session = await auth()

  if (session) return redirect('/')

  return (
    <Container py={'lg'} maw={500}>
      <Alert color='red' title='Kullanıcı bilgisi alınırken bir hata oluştu.'>
        <div>
          Girmiş olduğunuz bilgiler hatalı veya kullandığınız hesap bilgileri
          tamamlanmamış olabilir.
        </div>

        <div className='pt-3'>
          E-posta, telefon doğrulama işlemini tekrar gözden geçirin veya başka
          bir hesap kullanarak tekrar deneyebilirsiniz.
        </div>
      </Alert>
    </Container>
  )
}
