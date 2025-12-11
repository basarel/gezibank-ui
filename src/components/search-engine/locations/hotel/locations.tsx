import { useRef, useState } from 'react'
import {
  TextInput,
  Transition,
  Paper,
  CloseButton,
  TextInputProps,
  Skeleton,
  Grid,
  Title,
  Button,
} from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'
import { clsx } from 'clsx'

import { IoSearch } from 'react-icons/io5'

import { Input } from '@/components/search-engine/input'
import type {
  LocationResult,
  LocationResults,
} from '@/components/search-engine/locations/type'
import { FaBed } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { HiOutlineLocationMarker } from 'react-icons/hi'

type Props = {
  label: string
  inputProps?: TextInputProps
  onSelect?: (params: LocationResult) => void
  onChange?: (params: string) => void
  data?: LocationResults['Result']
  isLoading?: boolean
  defaultValue?: string
  popularDestinations?: {
    id: number
    name: string
    slug: string
    code: string
    iata: string[]
    typeId: number
    domestic: boolean
  }[]
}

export const Locations: React.FC<Props> = ({
  label,
  inputProps,
  onSelect = () => {},
  onChange = () => {},
  isLoading = false,
  data = [],
  defaultValue = '',
  popularDestinations,
}) => {
  const [locationContainerOpened, setLocationContainerOpened] = useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setLocationContainerOpened(false)
  )
  const [originValue, setOriginValue] = useState('')

  const focusTrapRef = useFocusTrap(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOnSelect = (location: LocationResult) => {
    onSelect(location)
    setLocationContainerOpened(false)
  }

  return (
    <div className='relative h-full'>
      <Input
        label={label}
        onClick={() => {
          setLocationContainerOpened(true)
        }}
        error={!!inputProps?.error}
        title={defaultValue}
      />
      <Transition mounted={locationContainerOpened} transition='pop-top-right'>
        {(styles) => (
          <Paper
            ref={clickOutsideRef}
            className='fixed start-0 end-0 top-0 bottom-0 z-50 -ms-1 -mt-1 bg-white shadow-xl md:absolute md:end-auto md:bottom-auto md:max-w-[420px] md:min-w-[320px]'
            style={{ ...styles }}
          >
            <div className='flex justify-end md:hidden'>
              <CloseButton
                size={'xl'}
                onClick={() => setLocationContainerOpened(false)}
              />
            </div>
            <div className='sticky top-0 p-2' ref={focusTrapRef}>
              <label htmlFor='location_select' className='sr-only'>
                {label}
              </label>
              <TextInput
                ref={inputRef}
                value={originValue}
                onChange={(event) => {
                  setOriginValue(event.currentTarget.value)
                  onChange(event.currentTarget.value)
                }}
                onFocus={(event) => event.target.select()}
                autoComplete='off'
                id='location_select'
                placeholder={label}
                size='xl'
                className='font-bold'
                rightSectionPointerEvents='all'
                rightSection={
                  <CloseButton
                    onClick={() => {
                      inputRef.current?.focus()
                      setOriginValue('')
                    }}
                    aria-label='Aramayı temizle'
                    style={{ display: originValue ? undefined : 'none' }}
                  />
                }
              />
            </div>
            <div className='max-h-[400px] min-h-[400px] overflow-y-auto rounded-md border border-t-0'>
              <div
                className={clsx('grid w-9/12 gap-3 p-4', {
                  visible: isLoading,
                  hidden: !isLoading,
                })}
              >
                <Skeleton height={12} radius='xl' />
                <Skeleton height={12} mt={6} width='70%' radius='xl' />
                <Skeleton height={12} mt={6} radius='xl' />
              </div>
              {data?.length > 0 && (
                <div>
                  {data.map((location) => {
                    const { Name, SubDestinations, Id } = location

                    if (!SubDestinations.length) {
                      return (
                        <div key={Id}>
                          <div className='hover:text-blue-filled hover:border-s-blue-filled relative rounded-md border-s-4 border-s-transparent hover:bg-blue-100'>
                            <button
                              type='button'
                              className='absolute start-0 end-0 top-0 bottom-0 border-0 bg-transparent p-0 transition-all hover:bg-blue-300/15'
                              onClick={() => {
                                handleOnSelect(location)
                              }}
                            >
                              <span className='sr-only'>{Name}</span>
                            </button>
                            <div className='flex items-center gap-3 p-4'>
                              <div className='text-2xl'>
                                <FaBed />
                              </div>
                              <div className='truncate'>
                                <strong>{Name}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return SubDestinations.map((destination) => (
                      <div key={destination.Id}>
                        <div className='hover:text-blue-filled hover:border-s-blue-filled relative rounded-md border-s-4 border-s-transparent hover:bg-blue-100'>
                          <button
                            type='button'
                            className='absolute start-0 end-0 top-0 bottom-0 border-0 bg-transparent p-0'
                            onClick={() => {
                              handleOnSelect(destination)
                            }}
                          >
                            <span className='sr-only'>{destination.Name}</span>
                          </button>
                          <div className='flex items-center gap-2 p-4'>
                            <div className='text-2xl'>
                              <HiOutlineLocationMarker />
                            </div>
                            <div className='flex flex-col'>
                              <strong className='truncate'>
                                {destination.Name}
                              </strong>
                              <small>{Name}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  })}
                </div>
              )}
              {!isLoading && data.length === 0 ? (
                <div className='flex flex-col items-center gap-2 p-3 text-center'>
                  <div className='text-4xl'>
                    <IoSearch />
                  </div>
                  <div className='text-sm'>Otel veya Şehir arayın.</div>
                </div>
              ) : null}
              {popularDestinations && popularDestinations.length > 0 && (
                <Grid px={'sm'} gutter={'xs'} my={'md'}>
                  <Grid.Col>
                    <Title order={4}>Popüler Şehirler</Title>
                  </Grid.Col>
                  {popularDestinations?.map((destination) => {
                    return (
                      <Grid.Col key={destination.id} span={4}>
                        <Button
                          size='sm'
                          fullWidth
                          variant='outline'
                          color='gray.7'
                          onClick={() => {
                            handleOnSelect({
                              Code: destination.code,
                              CountryCode: '',
                              ExtentionData: {},
                              Iata: destination.iata,
                              Id: destination.id,
                              IsDomestic: destination.domestic,
                              Location: [],
                              Name: destination.name,
                              Northeast: [],
                              ParentIds: [],
                              Select: true,
                              Slug: destination.slug,
                              Southwest: [],
                              SubDestinations: [],
                              Type: 1,
                            })
                          }}
                        >
                          {destination.name}
                        </Button>
                      </Grid.Col>
                    )
                  })}
                </Grid>
              )}
            </div>
          </Paper>
        )}
      </Transition>
    </div>
  )
}
