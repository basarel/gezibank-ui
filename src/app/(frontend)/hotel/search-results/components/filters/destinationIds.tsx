import { useState } from 'react'

import { HotelSearchResponseDestinationInfos } from '@/app/(frontend)/hotel/types'
import {
  Alert,
  Checkbox,
  CloseButton,
  rem,
  ScrollArea,
  Stack,
  TextInput,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'

import { hotelFilterSearchParams } from '@/modules/hotel/searchParams'
import { cyprusFilterSearchParams } from '@/modules/cyprus/searchParams'
import { IoSearchOutline } from 'react-icons/io5'

type IProps = {
  destinationsInfo: HotelSearchResponseDestinationInfos[] | undefined
  filterParams?: 'hotel' | 'cyprus'
}

const DestinationIds: React.FC<IProps> = ({
  destinationsInfo = [],
  filterParams = 'hotel',
}) => {
  const [values, setValues] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState(destinationsInfo)

  const [queryParams, setQueryParams] = useQueryStates(
    filterParams === 'cyprus'
      ? cyprusFilterSearchParams
      : hotelFilterSearchParams
  )

  const handleSearchInput = (searchTerm: string) => {
    setSearchValue(searchTerm)

    setFilteredData(() => {
      return destinationsInfo?.filter((data) =>
        data.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      )
    })
  }

  return (
    <>
      <div className='pb-3'>
        <TextInput
          leftSection={<IoSearchOutline size={16} />}
          placeholder='Filtrele'
          size='xs'
          type='search'
          rightSection={
            <CloseButton
              size={'sm'}
              onClick={() => {
                setFilteredData(destinationsInfo)
                setSearchValue('')
              }}
            />
          }
          value={searchValue}
          onChange={(event) => {
            handleSearchInput(event.currentTarget.value)
          }}
        />
      </div>
      <ScrollArea.Autosize mah={rem(200)} type='always' scrollbars='y'>
        <Checkbox.Group
          value={
            queryParams.destinationIds?.length
              ? queryParams.destinationIds.map(String)
              : []
          }
          onChange={(value) => {
            setQueryParams({ destinationIds: value.length ? value : null })
          }}
        >
          <Stack gap={4} p={rem(4)}>
            {filteredData?.length > 0 ? (
              filteredData
                ?.sort((a, b) => b.count - a.count)
                .map((destinationInfo) => {
                  return (
                    <Checkbox
                      key={destinationInfo.id}
                      label={`${destinationInfo.name} (${destinationInfo.count})`}
                      value={'' + destinationInfo.id}
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
    </>
  )
}

export { DestinationIds }
