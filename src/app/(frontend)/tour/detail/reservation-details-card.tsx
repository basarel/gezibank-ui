'use client'

import React from 'react'
import { Title } from '@mantine/core'
import { TourDetailApiResponse } from '@/modules/tour/type'
import { formatCurrency } from '@/libs/util'
import dayjs from 'dayjs'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { FaBus, FaUsers, FaTag } from 'react-icons/fa'
import { RiPlaneFill, RiInformationLine } from 'react-icons/ri'
import { TbCalendarClock } from 'react-icons/tb'
import { SearchCampaign } from '@/libs/payload'
import Link from 'next/link'
import { Route } from 'next'

type ReservationDetailsCardProps = {
  data: TourDetailApiResponse
  startDate: string | undefined
  endDate: string | undefined
  totalNights: number
  totalDays: number
  itineraryText: string
  transportType: number | undefined
  transportTypeText: string
  passengers: {
    adultCount: string
    childAge?: (string | undefined)[] | undefined
  }
  calculatedTotalPrice: number
  tourCampaigns: SearchCampaign[]
  isDomestic: boolean
}

export const ReservationDetailsCard: React.FC<ReservationDetailsCardProps> = ({
  data,
  startDate,
  endDate,
  totalNights,
  totalDays,
  itineraryText,
  transportType,
  transportTypeText,
  passengers,
  calculatedTotalPrice,
  tourCampaigns,
  isDomestic,
}) => {
  const dayjsStartDate = dayjs(startDate)

  const filteredCampaigns = tourCampaigns.filter((campaign) => {
    if (campaign.active === false) return false
    if (isDomestic) {
      return campaign.viewCountry === '1'
    } else {
      return campaign.viewCountry === '0'
    }
  })

  return (
    <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200">
      <Title order={3} fz={'h2'} className="mb-4 font-bold text-blue-600 md:text-2xl">
        Rezervasyon Detayları
      </Title>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Hareket Tarihi</div>
          <div className="text-base font-medium">
            {startDate ? dayjsStartDate.format('DD MMM YYYY ddd') : '-'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Tur Süresi</div>
          <div className="text-base font-medium">
            {totalNights === 0
              ? 'Günübirlik'
              : `${totalNights} Gece ${totalDays} Gün`}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-base font-medium text-gray-900">
          {data?.package.title}
        </div>
      </div>

      <div className="flex flex-col gap-5 mb-4">
        {itineraryText && (
          <div className="flex items-center gap-2">
            <HiOutlineLocationMarker
              size={20}
              className="shrink-0 text-blue-700"
            />
            <span className="text-sm">{itineraryText}</span>
          </div>
        )}

        {transportTypeText && (
          <div className="flex items-center gap-2">
            {transportType === 1 ? (
              <RiPlaneFill size={20} className="shrink-0 text-blue-700" />
            ) : (
              <FaBus size={18} className="shrink-0 text-blue-700" />
            )}
            <span className="text-sm">
              Gidiş-Dönüş: {transportTypeText.replace(' Tur', '')}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <TbCalendarClock size={20} className="shrink-0 text-blue-700" />
          <span className="text-sm">
            {totalNights === 0
              ? 'Günübirlik Tur'
              : `${totalNights} Gece ${totalDays} Gün`}{' '}          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaUsers size={18} className="shrink-0 text-blue-700" />
            <span className="text-sm">
              {passengers.adultCount.split(':')[0]} Yetişkin
            </span>
            {passengers.childAge && passengers.childAge.length > 0 && (
              <span className="text-sm">
               , {passengers.childAge.length} Çocuk ({passengers.childAge.join(', ')} yaşında)
              </span>
            )}

        </div>
      </div>
        {filteredCampaigns.length > 0 && (
          <div className="grid md:grid-cols-2 gap-2">
            {filteredCampaigns.slice(0, 4).map((campaign) => (
            <Link
              key={campaign.id}
              href={campaign.link as Route}
              className="flex w-full gap-5 items-center justify-between border shadow border-gray-200 hover:border-blue-600 rounded-md px-2 py-2 hover:bg-gray-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <FaTag size={16} className="text-blue-700 shrink-0" />
                <span className="text-sm text-gray-700">{campaign.text}</span>
              </div>
              <RiInformationLine size={18} className="text-gray-500 shrink-0" />
            </Link>
          ))}
        </div>
      )}
      <div className='text-dark-400 hidden text-xs md:flex mt-4'> Not : Çocuk kategorisi 7-12 yaşları arasıdır. Tur sirküsü yayımlandığı 02.01.2026 tarihinde geçerlidir. Aynı tura ait, daha sonraki bir tarihte yayımlanacak tur sirküsü bir öncekini geçersiz kılar. Zorunlu ek hizmetler fiyata dahildir. </div>
    </div>
  )
}

