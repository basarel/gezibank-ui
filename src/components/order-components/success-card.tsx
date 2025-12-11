import { Column, Container, Img, Row, Section } from '@react-email/components'
type IProps = {
  name: React.ReactNode
}

export const SuccessCard: React.FC<IProps> = ({ name }: IProps) => {
  return (
    <>
      <div className='border border-solid border-[green]'>
        <Section cellPadding={16} cellSpacing={0}>
          <Row>
            <Column align='center'>
              <Img
                src={`https://ykmturizm.mncdn.com/11/Files/email/img/check-icon.png`}
                className='mx-auto'
              />
            </Column>
          </Row>
          <Row>
            <Column>&nbsp;</Column>
          </Row>
          <Row>
            <Column align='center'>
              <div>
                Sayın {name},
                <br /> İşleminiz başarı ile gerçekleşmiştir. Bir sonraki
                seyahatinizde görüşmek üzere
              </div>
            </Column>
          </Row>
        </Section>
      </div>
      <div className='h-[16px]'>&nbsp;</div>
    </>
  )
}
