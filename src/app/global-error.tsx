'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}>
      <head>
        <style>{`
          @media (max-width: 768px) {
            .header-container {
              padding: 12px 0 !important;
            }
            .header-nav {
              display: none !important;
              font-weight: 600 !important;
            }
            .header-phone {
              font-size: 14px !important;
            }
            .header-phone svg {
              width: 14px !important;
              height: 14px !important;
            }
            .logo-container img {
              width: 80px !important;
              height: auto !important;
            }
            .error-box {
              padding: 20px !important;
              margin: 0 12px !important;
            }
            .error-title {
              font-size: 20px !important;
            }
            .error-text {
              font-size: 14px !important;
            }
            .error-button {
              padding: 10px 20px !important;
              font-size: 14px !important;
            }
            .footer-top {
              flex-direction: column !important;
              gap: 20px !important;
              align-items: center !important;
            }
            .footer-phone-section {
              flex-direction: column !important;
              text-align: center !important;
            }
            .footer-phone-number {
              font-size: 18px !important;
            }
            .footer-links {
              gap: 16px !important;
              font-size: 14px !important;
            }
            .footer-copyright {
              font-size: 12px !important;
              margin-top: 16px !important;
              padding-top: 16px !important;
            }
            .footer-content {
              margin-top: 16px !important;
              margin-bottom: 16px !important;
              padding: 0 12px !important;
            }
          }
          @media (max-width: 480px) {
            .logo-container img {
              width: 60px !important;
            }
            .header-phone {
              font-size: 12px !important;
            }
            .error-box {
              padding: 16px !important;
            }
            .error-title {
              font-size: 18px !important;
              margin-bottom: 12px !important;
            }
            .error-text {
              font-size: 13px !important;
              margin-bottom: 16px !important;
            }
            .footer-phone-number {
              font-size: 16px !important;
            }
            .footer-links {
              flex-direction: column !important;
              gap: 12px !important;
            }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}>
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            width: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          <header
            className='header-container'
            style={{
              backgroundColor: 'white',
              borderBottom: '1px solid #e5e7eb',
              padding: '16px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <Link
                  href='/'
                  style={{ textDecoration: 'none' }}
                  className='logo-container'
                >
                  <Image
                    src='/logo.png'
                    alt='GeziBank'
                    width={118}
                    height={70}
                    style={{ cursor: 'pointer' }}
                  />
                </Link>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    className='header-nav'
                    style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '16px',
                      fontWeight: '500',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Link
                      href='/otel'
                      style={{ color: '#374151', textDecoration: 'none' }}
                    >
                      Otel
                    </Link>
                    <Link
                      href='/ucak'
                      style={{ color: '#374151', textDecoration: 'none' }}
                    >
                      Uçak
                    </Link>
                    <Link
                      href='/arac'
                      style={{ color: '#374151', textDecoration: 'none' }}
                    >
                      Araç
                    </Link>
                    <Link
                      href='/tur'
                      style={{ color: '#374151', textDecoration: 'none' }}
                    >
                      Tur
                    </Link>
                    <Link
                      href='/otobus'
                      style={{ color: '#374151', textDecoration: 'none' }}
                    >
                      Otobüs
                    </Link>
                    <Link
                      href='/transfer'
                      style={{ color: '#374151', textDecoration: 'none' }}
                    >
                      Transfer
                    </Link>
                  </div>
                  <a
                    href='tel:08508780400'
                    className='header-phone'
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#374151',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                    }}
                  >
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                    </svg>
                    0850 878 0 400
                  </a>
                </div>
              </div>
            </div>
          </header>

          <main style={{ flex: 1, position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage:
                  'url(https://ykmturizm.mncdn.com/11/Content/img/500.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                }}
              ></div>

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <div
                  className='error-box'
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '32px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '0 16px',
                    width: '100%',
                  }}
                >
                  <h2
                    className='error-title'
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '16px',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                    }}
                  >
                    Beklenmeyen bir hata oluştu.
                  </h2>
                  <p
                    className='error-text'
                    style={{
                      color: '#6b7280',
                      marginBottom: '24px',
                      fontSize: '18px',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                    }}
                  >
                    Üzgünüz! Bir şeyler ters gitti. Ekibimiz sorunu çözmek için
                    çalışıyor.{' '}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className='error-button'
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                    }}
                  >
                    Tekrar Deneyiniz
                  </button>
                </div>
              </div>
            </div>
          </main>

          <footer
            style={{
              backgroundColor: '#1e3a8a',
              color: 'white',
            }}
          >
            <div
              className='footer-content'
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 16px',
                marginTop: '20px',
                marginBottom: '20px',
                fontFamily: 'Arial, Helvetica, sans-serif',
              }}
            >
              {/* Social Media Links */}
              <div
                className='footer-top'
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <a
                    href='https://www.instagram.com/gezibank'
                    style={{
                      display: 'flex',
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1e3a8a',
                      textDecoration: 'none',
                    }}
                  >
                    <svg
                      stroke='currentColor'
                      fill='currentColor'
                      strokeWidth='0'
                      viewBox='0 0 24 24'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z'></path>
                    </svg>
                  </a>
                  <a
                    href='https://www.facebook.com/gezibank'
                    style={{
                      display: 'flex',
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1e3a8a',
                      textDecoration: 'none',
                    }}
                  >
                    <svg
                      stroke='currentColor'
                      fill='currentColor'
                      strokeWidth='0'
                      viewBox='0 0 24 24'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z'></path>
                    </svg>
                  </a>
                  <a
                    href='https://x.com/gezibank'
                    style={{
                      display: 'flex',
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1e3a8a',
                      textDecoration: 'none',
                    }}
                  >
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                    </svg>
                  </a>
                  <a
                    href='https://www.youtube.com/@gezibank'
                    style={{
                      display: 'flex',
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1e3a8a',
                      textDecoration: 'none',
                    }}
                  >
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                    </svg>
                  </a>
                </div>
                <div
                  className='footer-phone-section'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      color: '#f97316',
                    }}
                  ></div>
                  <div>
                    <div
                      className='footer-phone-number'
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      <a
                        href='tel:08508780400'
                        style={{ color: 'white', textDecoration: 'none' }}
                      >
                        0850 878 0 400
                      </a>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#cbd5e1',
                      }}
                    >
                      09:00-18:00 arasında arayabilirsiniz.
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '0px 0',
                  textAlign: 'center',
                }}
              >
                <div
                  className='footer-links'
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '32px',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link
                    href='/hakkimizda'
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Hakkımızda
                  </Link>
                  <Link
                    href='/iletisim'
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    İletişim
                  </Link>
                  <Link
                    href='/gizlilik-vd-güvenlik'
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Gizlilik ve Güvenlik
                  </Link>
                  <Link
                    href='/kullanim-sartlari'
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Kullanım Şartları
                  </Link>
                  <Link
                    href='/yardim/populer-sorular'
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Sıkça Sorulan Sorular
                  </Link>
                </div>
              </div>
              <div
                className='footer-copyright'
                style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  paddingTop: '20px',
                  fontSize: '14px',
                  color: '#cbd5e1',
                }}
              >
                GeziBank © {new Date().getFullYear()} Her Hakkı Saklıdır.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
