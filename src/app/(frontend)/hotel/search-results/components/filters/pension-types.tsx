import { HotelSearchResponsePensionTypes } from '@/app/(frontend)/hotel/types'
import { Alert, Checkbox, rem, ScrollArea, Stack } from '@mantine/core'
import { useQueryStates } from 'nuqs'

import { hotelFilterSearchParams } from '@/modules/hotel/searchParams'
import { cyprusFilterSearchParams } from '@/modules/cyprus/searchParams'

type IProps = {
  data: HotelSearchResponsePensionTypes[] | undefined | null
  filterParams?: 'hotel' | 'cyprus'
}

const PensionTypes: React.FC<IProps> = ({
  data = [],
  filterParams: filterType = 'hotel',
}) => {
  const filteredData = data
  const [filterParams, setFilterParams] = useQueryStates(
    filterType === 'cyprus' ? cyprusFilterSearchParams : hotelFilterSearchParams
  )

  return (
    <ScrollArea.Autosize mah={rem(200)} type='always' scrollbars='y'>
      <Checkbox.Group
        value={
          filterParams.pensionTypes?.length
            ? filterParams.pensionTypes.map(String)
            : []
        }
        onChange={(value) => {
          setFilterParams({ pensionTypes: value.length ? value : null })
        }}
      >
        <Stack gap={4} p={rem(4)}>
          {filteredData && filteredData?.length > 0 ? (
            filteredData
              ?.sort((a, b) => {
                if (!a.type && !b.type) return 0
                if (!a.type) return 1
                if (!b.type) return -1
                return a.type.localeCompare(b.type)
              })
              .map((dataItem) => {
                if (!dataItem.type) return null

                return (
                  <Checkbox
                    key={dataItem.id}
                    label={dataItem.type}
                    value={'' + dataItem.id}
                  />
                )
              })
          ) : (
            <Alert color='red' variant='light' p={5}>
              Sonuç bulunamadı.
            </Alert>
          )}
        </Stack>
      </Checkbox.Group>
    </ScrollArea.Autosize>
  )
}

export { PensionTypes }
