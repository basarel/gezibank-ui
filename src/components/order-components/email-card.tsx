import { Column, Heading, Row, Section } from '@react-email/components'

type IProps = {
  title: React.ReactNode
  children: React.ReactNode
}

export const EmailCard: React.FC<IProps> = ({ title, children }) => {
  return (
    <>
      <div className='h-[16px]'>&nbsp;</div>

      <div className='border-gray border border-solid'>
        <div
          className='border-b-gray'
          style={{
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
          }}
        >
          <Row>
            <Column className='text-md p-3 font-bold'> {title}</Column>
          </Row>
        </div>

        <Section className='mb-4 text-sm' cellPadding={12}>
          <Row>
            <Column>
              <div>{children}</div>
            </Column>
          </Row>
        </Section>
      </div>
    </>
  )
}
