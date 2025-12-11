import { TourExtraOptionsItemType } from '@/types/passengerViewModel'
import { NativeSelect } from '@mantine/core'

type IProps = {
  data: TourExtraOptionsItemType
  passengerIndex?: number
}

const defaultValues: { label: string; value: string }[] = [
  {
    label: 'Vize hizmeti satın alıyorum',
    value: '0|-|Vize hizmeti satın alıyorum',
  },
  { label: 'Vizem var', value: '3|HaveAlready|Vizem var' },
  {
    label: 'Yeşil pasaportum var',
    value: '1|HaveGreenPassport|Yeşil pasaportum var',
  },
  {
    label: 'Vizeyi kendim temin edeceğim',
    value: '2|WillGetMyself|Vizeyi kendim temin edeceğim',
  },
]

const VisaReason: React.FC<IProps> = ({ data, passengerIndex }) => {
  const extraItem = data

  const options: { label: string; value: string }[] =
    extraItem.filters && extraItem.filters.length > 0
      ? extraItem.filters?.map((filter) => ({
          label: filter.key,
          value: filter.value,
        }))
      : defaultValues
  const labelText =
    passengerIndex !== undefined
      ? `${passengerIndex + 1}. Yolcu`
      : extraItem.description

  return (
    <NativeSelect
      name={extraItem.code}
      label={labelText}
      data={options}
      defaultValue={options[0].value}
    />
  )
}

export { VisaReason }
