import { HotelDetailRoomItem } from '@/app/(frontend)/hotel/types'
import { Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { FaCheck, FaCheckCircle, FaTimes } from 'react-icons/fa'
import { IoMdInformationCircleOutline } from 'react-icons/io'

type IProps = {
  roomGroup: HotelDetailRoomItem
}
export const Refundable: React.FC<IProps> = ({ roomGroup }) => {
  const sortedCancellationPolicies =
    roomGroup.cancellationPolicies?.slice().sort((a, b) => {
      return new Date(a.optionDate).getTime() - new Date(b.optionDate).getTime()
    }) ?? []
  // console.log(roomGroup)
  const cancellationTooltipContent = sortedCancellationPolicies
    .map((cancelPolicy) => cancelPolicy.description)
    .filter(Boolean)
    .join('\n')

  return (
    <>
      {roomGroup.nonRefundable ? (
        <div className='inline-block rounded-md py-1'>
          <div className='flex items-center gap-1'>
            <span className='text-red flex items-center font-medium'>
              <FaTimes size={18} className='mr-2' /> İptal/İade Edilemez{' '}
            </span>
          </div>
        </div>
      ) : (
        <div className='inline-flex w-fit items-center gap-2 rounded-md bg-gray-200 px-1 py-2 text-sm md:px-1 md:text-base'>
          <div className='flex cursor-pointer items-center gap-1'>
            <span className='text-green flex items-center font-medium'>
              <FaCheckCircle size={18} className='mr-2' /> Ücretsiz İptal{' '}
            </span>
            {sortedCancellationPolicies.length > 0
              ? `${dayjs(sortedCancellationPolicies[0]?.optionDate).format(
                  'DD.MM.YYYY'
                )} tarihine kadar`
              : null}
            {cancellationTooltipContent && (
              <Tooltip
                multiline
                w={260}
                label={
                  <div className='text-sm whitespace-pre-wrap text-white'>
                    {cancellationTooltipContent}
                  </div>
                }
                withArrow
              >
                <span>
                  <IoMdInformationCircleOutline
                    size={17}
                    className='text-green'
                  />
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      )}
    </>
  )
}
