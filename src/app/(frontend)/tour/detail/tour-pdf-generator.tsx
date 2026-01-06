'use client'

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { pdf } from '@react-pdf/renderer'
import { TourDetailApiResponse } from '@/modules/tour/type'
import dayjs from 'dayjs'

const stripHtml = (html: string): string => {
  if (!html) return ''
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

if (typeof window !== 'undefined') {
  try {
    // Register normal weight
    Font.register({
      family: 'NotoSans',
      src: '/fonts/NotoSans-Regular.ttf',
    })
    // Register bold weight
    Font.register({
      family: 'NotoSans',
      src: '/fonts/NotoSans-Bold.ttf',
      fontWeight: 'bold',
    })
  } catch (error) {
    // Silently fail - will use default font
    console.warn('Noto Sans font not available, using default font')
  }
}

// Styles - Using NotoSans if registered, otherwise falls back to default
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'NotoSans',
  },
  logo: {
    width: 120,
    marginBottom: 15,
  },
  title: {
    fontSize: 10,
    marginBottom: 8,
    fontFamily: 'NotoSans',
    color: '#000000',
  },
  subtitle: {
    fontSize: 8,
    marginBottom: 4,
    color: '#666666',
    fontFamily: 'NotoSans',
  },
  sectionTitle: {
    fontSize: 10,
    marginTop: 12,
    marginBottom: 6,
    fontFamily: 'NotoSans',
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  sectionText: {
    fontSize: 8,
    marginBottom: 4,
    lineHeight: 1.4,
    color: '#000000',
    fontFamily: 'NotoSans',
  },
  cancellationTitle: {
    fontSize: 10,
    marginTop: 12,
    marginBottom: 6,
    fontFamily: 'NotoSans',
    fontWeight: 'bold',
    color: '#d50000',
  },
  dayTitle: {
    fontSize: 9,
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'NotoSans',
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  bulletPoint: {
    marginLeft: 10,
    marginBottom: 3,
    fontFamily: 'NotoSans',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
})

// PDF Document Component
const TourPDFDocument: React.FC<{ data: TourDetailApiResponse }> = ({
  data,
}) => {
  const startDate = data.package.startDate
  const endDate = data.package.endDate
  const dayjsStartDate = startDate ? dayjs(startDate) : null
  const dayjsEndDate = endDate ? dayjs(endDate) : null
  const totalNights =
    dayjsStartDate && dayjsEndDate
      ? dayjsEndDate.diff(dayjsStartDate, 'day')
      : 0
  const totalDays = totalNights + 1
  const formattedDateRange =
    dayjsStartDate && dayjsEndDate
      ? `${dayjsStartDate.format('DD MMMM YYYY')} - ${dayjsEndDate.format('DD MMMM YYYY')}`
      : null
  const durationText =
    totalNights === 0
      ? 'Günübirlik Tur'
      : `${totalNights} Gece ${totalDays} Gün - ${totalNights} Gece Konaklamalı`

  // Format cities
  const formattedCities: string[] = []
  if (data.package.cities && data.package.cities.length > 0) {
    const seenCities = new Set<string>()
    data.package.cities.forEach((city) => {
      const cityName = city.title
      if (!seenCities.has(cityName)) {
        seenCities.add(cityName)
        formattedCities.push(cityName)
      }
    })
  }

  const includedInfo =
    data.package.detail.includedInformation || data.detail.includedInformation
  const notIncludedInfo =
    data.package.detail.notIncludedInformation ||
    data.detail.notIncludedInformation
  const transportType = data.package.transportType
  const transportTypeText =
    transportType === 1
      ? 'Uçaklı Tur'
      : transportType === 2
        ? 'Otobüslü Tur'
        : transportType === 3
          ? 'Trenli Tur'
          : ''

  const flightInfo =
    data.package.detail.flightInformation || data.detail.flightInformation
  const departureInfo =
    data.package.detail.departureInformation || data.detail.departureInformation

  const hotelInformations = data.package.hotelInformations
  const hotelDescription = data.package.description

  const tourProgram = data.package.detail.tourProgram || data.detail.tourProgram

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Logo */}
        <Image src='/logo.png' style={styles.logo} cache={false} />

        {/* Tour Title */}
        <Text style={styles.title}>{data.package.title}</Text>

        {/* Tour Dates and Duration */}
        {formattedDateRange && (
          <Text style={styles.subtitle}>{formattedDateRange}</Text>
        )}
        {formattedDateRange && (
          <Text style={styles.subtitle}>{durationText}</Text>
        )}

        {/* Tour Itinerary */}
        {formattedCities.length > 0 && (
          <Text style={styles.subtitle}>{formattedCities.join(' – ')}</Text>
        )}

        {/* Included Services */}
        {includedInfo && includedInfo.trim() && (
          <>
            <Text style={styles.sectionTitle}>Fiyata Dahil Hizmetler</Text>
            <Text style={styles.sectionText}>{stripHtml(includedInfo)}</Text>
          </>
        )}

        {/* Not Included Services */}
        {notIncludedInfo && notIncludedInfo.trim() && (
          <>
            <Text style={styles.sectionTitle}>
              Fiyata Dahil Olmayan Hizmetler
            </Text>
            <Text style={styles.sectionText}>{stripHtml(notIncludedInfo)}</Text>
          </>
        )}

        {/* Transportation Info */}
        {((flightInfo && flightInfo.length > 0 && transportType === 1) ||
          (transportTypeText && transportType !== 1) ||
          departureInfo) && (
          <>
            <Text style={styles.sectionTitle}>Ulaşım Bilgisi</Text>
            {flightInfo &&
              flightInfo.length > 0 &&
              transportType === 1 &&
              flightInfo.map((flight, index) => {
                if (
                  flight &&
                  typeof flight === 'string' &&
                  flight.trim() &&
                  flight.trim() !== '0'
                ) {
                  const flightText = stripHtml(flight)
                  const label =
                    flightInfo.length === 2
                      ? index === 0
                        ? 'Gidiş Uçuşu: '
                        : 'Dönüş Uçuşu: '
                      : ''
                  return (
                    <Text key={index} style={styles.sectionText}>
                      {label}
                      {flightText}
                    </Text>
                  )
                }
                return null
              })}
            {transportTypeText && transportType !== 1 && (
              <Text style={styles.sectionText}>{transportTypeText}</Text>
            )}
            {departureInfo && departureInfo.trim() && (
              <Text style={styles.sectionText}>{stripHtml(departureInfo)}</Text>
            )}
          </>
        )}

        {/* Hotel Info */}
        {((hotelInformations && hotelInformations.length > 0) ||
          (hotelDescription && hotelDescription.trim())) && (
          <>
            <Text style={styles.sectionTitle}>Otel Bilgisi</Text>
            {hotelInformations &&
              hotelInformations.length > 0 &&
              hotelInformations.map((hotel, index) => {
                if (hotel.name) {
                  return (
                    <Text key={index} style={styles.sectionText}>
                      {hotel.name}
                    </Text>
                  )
                }
                return null
              })}
            {hotelDescription && hotelDescription.trim() && (
              <Text style={styles.sectionText}>
                {stripHtml(hotelDescription)}
              </Text>
            )}
          </>
        )}

        {tourProgram && tourProgram.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tur Programı</Text>
            {tourProgram.map((program, index) => (
              <View key={index}>
                {program.title && (
                  <Text style={styles.dayTitle}>
                    {!program.title && index + 1 ? `${index + 1}. Gün: ` : ''}{' '}
                    {program.title}
                  </Text>
                )}
                {program.description && (
                  <Text style={styles.sectionText}>
                    {stripHtml(program.description)}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Cancellation and Refund Rights */}
        <Text style={styles.cancellationTitle}>İptal İade Şartları</Text>
        <Text style={styles.sectionText}>
          Turumuzda yeterli sayıya ulaşılamadığı takdirde; iptal hakkı tur
          hareket tarihinden 20 gün öncesine kadar Gezibank'ta saklıdır. Böyle
          bir iptal durumunda Gezibank misafirlerine bizzat haber vermekle
          yükümlüdür.
        </Text>

        {/* Flight Tours Section */}
        {transportType === 1 && (
          <>
            <Text style={styles.sectionTitle}>Uçaklı Turlarımızda;</Text>
            <Text style={styles.bulletPoint}>
              • Uçak ile ilgili bölümlerde havayolu sözleşmesi geçerlidir.
            </Text>
            <Text style={styles.bulletPoint}>
              • İptal sigortaları uçak ulaşımını kapsamaz.
            </Text>
            <Text style={styles.bulletPoint}>
              • Kademeli fiyat sistemi mevcuttur.
            </Text>
            <Text style={styles.bulletPoint}>
              • İlan edilen fiyat en düşük sınıftan açılan fiyattır.
            </Text>
            <Text style={styles.bulletPoint}>
              • Uçaklı tur programlarında "ekonomik sınıf" kullanılmaktadır.
            </Text>
            <Text style={styles.bulletPoint}>
              • Tur uçuş biletleri gidiş-dönüş birlikte kesilmektedir. Gidiş
              uçuşu kullanılmayan durumlarda dönüş uçuşu havayolu şirketlerinin
              uyguladığı sıralı kullanım şartı uyarınca kullanılamaz hale
              gelmektedir, iptale dönmektedir. Bu sebeple sadece dönüş uçuşuna
              katılmak mümkün olmamaktadır.
            </Text>
          </>
        )}
      </Page>
    </Document>
  )
}

// Generate and download PDF
export const generateTourPDF = async (
  data: TourDetailApiResponse
): Promise<void> => {
  try {
    const blob = await pdf(<TourPDFDocument data={data} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'tur-programi.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('PDF oluşturma hatası:', error)
    throw error
  }
}
