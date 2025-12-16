import { formatCurrency } from '@/libs/util'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { Group, Image, Radio, Table, Accordion } from '@mantine/core'
import { Fragment } from 'react'
import { FaInfoCircle } from 'react-icons/fa'
import { MdInfo } from 'react-icons/md'

type IProps = {
  data: ProductPassengerApiResponseModel['paymentIndexModel']['installment']['installmentInfoList']
}

const InstallmentTableModal: React.FC<IProps> = ({ data }) => {
  const groupedInstallmentData = Object.groupBy(
    data,
    ({ bankName }) => bankName
  )

  const installmentCountArr = Object.values(groupedInstallmentData)
    .flat()
    .map((a) => {
      return a?.installmentCount
    })
    .sort()
    .filter(
      (item, itemIndex, itemArr) =>
        itemArr.findIndex((item2) => item2 === item) === itemIndex
    )

  return (
    <>
      <div className='hidden md:block'>
        <Table withTableBorder withColumnBorders withRowBorders striped>
          <Table.Tbody>
            {Object.keys(groupedInstallmentData).map(
              (installmentData, installmentDataIndex) => {
                const currentInstallmentTableArr = groupedInstallmentData[
                  installmentData
                ]
                  ?.filter(
                    (item, itemIndex, itemArr) =>
                      itemArr.findIndex(
                        (item2) =>
                          item2.installmentCount === item.installmentCount
                      ) === itemIndex
                  )
                  .sort((a, b) => a.installmentCount + b.totalAmount)

                return (
                  <Fragment key={installmentDataIndex}>
                    <Table.Tr>
                      <Table.Td rowSpan={3} className='bg-gray-100'>
                        <Image
                          src={`https://ykmturizm.mncdn.com/7/Content/img/card-logos/${installmentData.toLowerCase()}.png`}
                          maw={90}
                          alt={installmentData}
                          mx={'auto'}
                        />
                      </Table.Td>
                      <Table.Td className='bg-gray-100'></Table.Td>
                      <Table.Td className='bg-gray-100'>
                        <div className='text-center font-bold'>Tek Çekim</div>
                      </Table.Td>
                      {installmentCountArr.map(
                        (count) =>
                          count &&
                          count > 1 && (
                            <Table.Td key={count} className='bg-gray-100'>
                              <div className='text-center font-bold'>
                                <div>{count} Taksit</div>
                              </div>
                            </Table.Td>
                          )
                      )}
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <div className='text-center font-bold'>
                          Aylık Taksit
                        </div>
                      </Table.Td>
                      {installmentCountArr.map((installmentCount) => {
                        const relatedInstallment =
                          currentInstallmentTableArr?.find(
                            (item) => item.installmentCount === installmentCount
                          )
                        return (
                          <Table.Td
                            key={installmentCount}
                            className='text-center'
                          >
                            {relatedInstallment ? (
                              relatedInstallment.installmentCount === 1 ? (
                                <div className='font-bold'>-</div>
                              ) : (
                                <div>
                                  {formatCurrency(
                                    relatedInstallment.amountPerInstallment
                                  )}
                                </div>
                              )
                            ) : (
                              '-'
                            )}
                          </Table.Td>
                        )
                      })}
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td className='bg-white text-center font-bold'>
                        Toplam Tutar
                      </Table.Td>
                      {installmentCountArr.map((installmentCount) => {
                        const relatedInstallment =
                          currentInstallmentTableArr?.find(
                            (item) => item.installmentCount === installmentCount
                          )
                        return (
                          <Table.Td
                            key={installmentCount}
                            className='bg-white text-center'
                          >
                            {relatedInstallment ? (
                              <div>
                                {formatCurrency(relatedInstallment.totalAmount)}
                              </div>
                            ) : (
                              '-'
                            )}
                          </Table.Td>
                        )
                      })}
                    </Table.Tr>
                  </Fragment>
                )
              }
            )}
          </Table.Tbody>
        </Table>
      </div>
      <div className='md:hidden'>
        <Accordion
          defaultValue={Object.keys(groupedInstallmentData)[0]}
          multiple={false}
          radius='md'
          className='divide-y divide-gray-100 rounded border border-gray-200 px-0'
          classNames={{ content: 'px-0', panel: 'px-0' }}
        >
          {Object.entries(groupedInstallmentData).map(
            ([bankName, items], idx) => {
              const uniqueByCount = items
                ?.filter(
                  (item, itemIndex, itemArr) =>
                    itemArr.findIndex(
                      (i) => i.installmentCount === item.installmentCount
                    ) === itemIndex
                )
                .sort((a, b) => a.installmentCount - b.installmentCount)

              const rows = [] as Array<{
                label: string
                monthly: string | '-'
                total: string | '-'
              }>
              uniqueByCount?.forEach((it) => {
                if (it.installmentCount === 1) {
                  rows.push({
                    label: 'Peşin',
                    monthly: formatCurrency(it.totalAmount),
                    total: formatCurrency(it.totalAmount),
                  })
                } else {
                  rows.push({
                    label: `${it.installmentCount} Taksit`,
                    monthly: formatCurrency(it.amountPerInstallment),
                    total: formatCurrency(it.totalAmount),
                  })
                }
              })

              return (
                <Accordion.Item
                  key={idx}
                  value={bankName}
                  className='px-0'
                  classNames={{ item: 'px-0' }}
                >
                  <Accordion.Control>
                    <div className='flex items-center justify-start px-3 py-1'>
                      <Image
                        src={`https://ykmturizm.mncdn.com/7/Content/img/card-logos/${bankName.toLowerCase()}.png`}
                        maw={90}
                        alt={bankName}
                      />
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
                        {rows.map((r, rIdx) => (
                          <Table.Tr key={rIdx}>
                            <Table.Td className='font-medium'>
                              {r.label}
                            </Table.Td>
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
                  </Accordion.Panel>
                </Accordion.Item>
              )
            }
          )}
        </Accordion>
      </div>

      <div>
        <div className='my-2 flex gap-1 text-xs'>
          <MdInfo className='text-blue-600' size={18} />
          Yönetmelik doğrultusunda; ticari kartlarla yapılan işlemlerde ödeme
          erteleme kampanyasından yararlanılamıyor ve taksit yapılamıyor.
        </div>
      </div>
    </>
  )
}

type InstallmentData = {
  amountPerInstallment: number
  bankName: string
  binList: string
  cardProgramName: string
  installmentCount: number
  totalAmount: number
}
type InstallmentSelectProps = {
  data: InstallmentData[]
  onChange: (value: InstallmentData) => void
  value: number
}

const InstallmentSelect: React.FC<InstallmentSelectProps> = ({
  data,
  onChange,
  value,
}) => {
  const installmentData =
    data && Array.isArray(data) && data.filter((item) => item.totalAmount > 0)

  if (!installmentData) return

  return (
    <Radio.Group
      name='Installment'
      onChange={(value) => {
        const selectedInstallment = installmentData.find(
          (installment) => installment.installmentCount === +value
        )
        if (selectedInstallment) {
          onChange(selectedInstallment)
        }
      }}
      value={'' + value}
    >
      <div className='grid gap-3'>
        {installmentData.map((installment, installmentIndex) => (
          <Radio.Card
            className='rounded border-0 bg-gray-50 p-4'
            key={installmentIndex}
            value={'' + installment.installmentCount}
          >
            <Group>
              <Radio.Indicator />
              <div className='flex flex-1 items-center justify-between'>
                <div className='leading-lg'>
                  {installment.installmentCount === 1 ? (
                    <div>
                      <div className='font-semibold text-blue-800'>
                        Peşin Ödeme
                      </div>
                      <div>Tek Çekim</div>
                    </div>
                  ) : (
                    <div>
                      <div className='font-semibold'>
                        {installment.installmentCount} Taksit
                      </div>
                      <div className='flex'>
                        <div>{installment.installmentCount}</div>
                        <div>x</div>
                        <div>
                          {formatCurrency(installment.amountPerInstallment)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>{formatCurrency(installment.totalAmount)}</div>
              </div>
            </Group>
          </Radio.Card>
        ))}
      </div>
    </Radio.Group>
  )
}

export { InstallmentTableModal, InstallmentSelect }
