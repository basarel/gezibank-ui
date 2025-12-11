import {
  CodeBlock,
  dracula,
  Html,
  Body,
  Preview,
} from '@react-email/components'

type IProps = {
  code: string
}
function PaymentErrorMail({ code }: IProps) {
  return (
    <Html>
      <Preview>Odeme anında alınan hata</Preview>
      <Body>
        <CodeBlock theme={dracula} lineNumbers language='json' code={code} />
      </Body>
    </Html>
  )
}

export default PaymentErrorMail
