'use client'

import { Title } from '@mantine/core'
import { HelpPage } from '@/app/(frontend)/contact-us/_components/help-form-page'

type ContactBlockProps = {
  showContactForm?: boolean
  showContactInfo?: boolean
  addressLabel?: string
  addressValue?: string
  callLabel?: string
  callValue?: string
  faxLabel?: string
  faxValue?: string
  emailLabel?: string
  emailValue?: string
  mapHtml?: string
}

export const ContactBlock: React.FC<ContactBlockProps> = ({
  showContactForm = true,
  showContactInfo = true,
  addressLabel,
  addressValue,
  callLabel,
  callValue,
  faxLabel,
  faxValue,
  emailLabel,
  emailValue,
  mapHtml,
}) => {
  return (
    <>
      {showContactForm && <HelpPage />}

      {showContactInfo && (
        <div>
          <div className='mb-5 rounded-md border p-3'>
            <Title order={2} className='mb-4'>
              İletişim Bilgileri
            </Title>

            <div className='space-y-3'>
              {addressLabel && addressValue && (
                <div className='flex items-start gap-3'>
                  <div className='flex items-center gap-2'>
                    <strong className='text-gray-800'>{addressLabel}</strong>
                    <div className='text-gray-600'>{addressValue}</div>
                  </div>
                </div>
              )}

              {callLabel && callValue && (
                <div className='flex items-start gap-3'>
                  <div className='flex items-center gap-2'>
                    <strong className='text-gray-800'>{callLabel}</strong>
                    <a
                      href={`tel:${callValue.trim()}`}
                      className='text-blue-600 hover:underline'
                    >
                      {callValue}
                    </a>
                  </div>
                </div>
              )}

              {faxLabel && faxValue && (
                <div className='flex items-start gap-3'>
                  <div className='flex items-center gap-1'>
                    <strong className='text-gray-800'>{faxLabel}</strong>
                    <div className='text-gray-600'>{faxValue}</div>
                  </div>
                </div>
              )}

              {emailLabel && emailValue && (
                <div className='flex items-start gap-3'>
                  <div className='flex items-center gap-2'>
                    <strong className='text-gray-800'>{emailLabel}</strong>
                    <a
                      href={`mailto:${emailValue}`}
                      className='text-blue-600 hover:underline'
                    >
                      {emailValue}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          {mapHtml && (
            <div>
              <div className='space-y-4'>
                <div className='overflow-hidden rounded-md border'>
                  <div dangerouslySetInnerHTML={{ __html: mapHtml }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
