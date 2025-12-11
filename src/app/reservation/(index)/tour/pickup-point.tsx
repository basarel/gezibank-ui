import {
  TourExtraOptionsItemType,
  TourExtraOptionsTypes,
} from '@/types/passengerViewModel'
import { NativeSelect } from '@mantine/core'

type IProps = {
  data: TourExtraOptionsItemType
  passengerIndex?: number
}

const PickUpPointSelect: React.FC<IProps> = ({ data, passengerIndex }) => {
  if (!data) return null
  const extraItem = data

  const values = extraItem.filters
    ?.find((item) => item.key === 'PickUpPointCode')
    ?.value.split('@') as string[]

  const labels = extraItem.filters
    ?.find((item) => item.key === 'PickUpPointExplain')
    ?.value.split('@') as string[]
  const options: { label: string; value: string }[] = []

  if (labels && values) {
    values.forEach((value, valueIndex) => {
      options.push({
        label: labels[valueIndex] ?? '',
        value: `${value}|${labels[valueIndex] ?? ''}|${labels[valueIndex] ?? ''}`,
      })
    })
  } else {
    extraItem.filters?.forEach((extraItemValue) => {
      options.push({
        value: extraItemValue.key,
        label: extraItemValue.value,
      })
    })
  }

  const labelText =
    passengerIndex !== undefined
      ? `${passengerIndex + 1}. Yolcu`
      : extraItem.description

  return (
    <NativeSelect
      name={extraItem.code}
      label={<div className='text-sm font-medium'>{labelText}</div>}
      data={options}
      defaultValue={options[0].value}
    />
  )
}

export { PickUpPointSelect }
