import { Fragment } from 'react'
import { Image, Table, Accordion } from '@mantine/core'

import { HotelDetailInstallmentData } from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import { InstallmentBankDescription } from './installment-description'
import { CiCircleInfo } from 'react-icons/ci'
import { MdInfo } from 'react-icons/md'

type IProps = {
  price: number
  installmentData: HotelDetailInstallmentData
}

const InstallmentTable: React.FC<IProps> = ({ price, installmentData }) => {
  const bankRows = installmentData.items.map((item) => (
    <Fragment key={item.bank}>
      <Table.Tr>
        <Table.Td rowSpan={3} className='bg-gray-100'>
          <Image src={item.logo} maw={90} mx={'auto'} alt={item.bank} />
        </Table.Td>
        <Table.Td className='bg-gray-100'></Table.Td>
        <Table.Td className='bg-gray-100'>
          <div className='text-center font-bold'>Tek Çekim</div>
        </Table.Td>
        {installmentData.headers.map((header) => (
          <Table.Td key={header} className='bg-gray-100'>
            <div className='text-center font-bold'>
              <div>{header} Taksit</div>
            </div>
          </Table.Td>
        ))}
      </Table.Tr>
      <Table.Tr>
        <Table.Td className='font-bold'>Aylık Taksit</Table.Td>
        <Table.Td>{formatCurrency(price)}</Table.Td>
        {installmentData.headers.map((header, headerIndex) => {
          const calculatedPrice =
            price + (price * item.installments[header]) / 100
          return (
            <Table.Td key={headerIndex}>
              <div className='text-center'>
                {typeof item.installments[header] === 'number' ? (
                  <div>{formatCurrency(calculatedPrice / header)}</div>
                ) : (
                  '-'
                )}
              </div>
            </Table.Td>
          )
        })}
      </Table.Tr>
      <Table.Tr>
        <Table.Td className='bg-white font-bold'>Toplam Fiyat</Table.Td>
        <Table.Td className='bg-white'>{formatCurrency(price)}</Table.Td>
        {installmentData.headers.map((header, headerIndex) => {
          const calculatedPrice =
            price + (price * item.installments[header]) / 100
          return (
            <Table.Td key={headerIndex} className='bg-white'>
              <div className='text-center'>
                {typeof item.installments[header] === 'number' ? (
                  <div className='font-normal'>
                    {formatCurrency(calculatedPrice)}
                  </div>
                ) : (
                  '-'
                )}
              </div>
            </Table.Td>
          )
        })}
      </Table.Tr>
      {item.description && (
        <Table.Tr>
          <Table.Td colSpan={installmentData.headers.length + 3}>
            <InstallmentBankDescription
              content={
                <div
                  className='text-xs'
                  dangerouslySetInnerHTML={{
                    __html: item.description,
                  }}
                />
              }
            />
          </Table.Td>
        </Table.Tr>
      )}
    </Fragment>
  ))

  return (
    <div>
      <div className='hidden md:block'>
        <Table stickyHeader stickyHeaderOffset={0} striped withColumnBorders>
          <Table.Tbody>{bankRows}</Table.Tbody>
        </Table>
      </div>
      <div className='m-0 p-0 md:hidden'>
        <Accordion
          defaultValue={installmentData.items[0].bank}
          multiple={false}
          radius='md'
          className='divide-y divide-gray-100 rounded border border-gray-200 px-0'
          classNames={{ content: 'px-0' }}
        >
          {installmentData.items.map((item) => {
            const rows = [] as Array<{
              label: string
              monthly: string | '-'
              total: string | '-'
            }>
            rows.push({
              label: 'Peşin',
              monthly: formatCurrency(price),
              total: formatCurrency(price),
            })

            installmentData.headers.forEach((header) => {
              const rate = item.installments[header]
              if (typeof rate === 'number') {
                const total = price + (price * rate) / 100
                rows.push({
                  label: `${header} Taksit`,
                  monthly: formatCurrency(total / header),
                  total: formatCurrency(total),
                })
              } else {
                rows.push({
                  label: `${header} Taksit`,
                  monthly: '-',
                  total: '-',
                })
              }
            })

            return (
              <Accordion.Item
                key={item.bank}
                value={item.bank}
                className='px-0'
                classNames={{
                  item: 'px-0',
                }}
              >
                <Accordion.Control>
                  <div className='flex items-center justify-start px-3 py-1'>
                    <Image src={item.logo} maw={90} alt={item.bank} />
                  </div>
                </Accordion.Control>
                <Accordion.Panel className='px-0'>
                  <Table striped withColumnBorders className='text-sm'>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>TAKSIT</Table.Th>
                        <Table.Th className='text-center'>
                          TAKSIT TUTARI
                        </Table.Th>
                        <Table.Th className='text-center'>
                          TOPLAM TUTAR
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody className='px-0'>
                      {rows.map((r, idx) => (
                        <Table.Tr key={idx}>
                          <Table.Td className='font-medium'>{r.label}</Table.Td>
                          <Table.Td>
                            <div className='text-center'>{r.monthly}</div>
                          </Table.Td>
                          <Table.Td>
                            <div className='text-center'>{r.total}</div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>

                  {item.description && (
                    <div className='mt-2'>
                      <InstallmentBankDescription
                        content={
                          <div
                            className='text-xs'
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        }
                      />
                    </div>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            )
          })}
        </Accordion>
      </div>

      <div className='my-2 flex gap-1 text-xs'>
        <MdInfo className='text-blue-600' size={18} />
        Yönetmelik doğrultusunda; ticari kartlarla yapılan işlemlerde ödeme
        erteleme kampanyasından yararlanılamıyor ve taksit yapılamıyor.
      </div>
    </div>
  )
}

export { InstallmentTable }
