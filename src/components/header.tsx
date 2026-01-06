'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { useSession, signOut } from 'next-auth/react'
import {
  Button,
  Drawer,
  Burger,
  Anchor,
  Container,
  Skeleton,
  Menu,
  Box,
  UnstyledButton,
  Grid,
  Title,
  Avatar,
} from '@mantine/core'
import {
  FaRegUserCircle,
  FaUser,
  FaInfoCircle,
  FaUserPlus,
} from 'react-icons/fa'
import { IoIosLogOut } from 'react-icons/io'
import PersonLetters from '@/app/(frontend)/account/_components/person-letters'
import AccountSideNav from '@/app/(frontend)/account/_components/side-nav'
import { useDisclosure } from '@mantine/hooks'
import { HeaderMenu } from './header-menu'
import { FaBed } from 'react-icons/fa'
import { MdAirplanemodeActive } from 'react-icons/md'
import { FaCar } from 'react-icons/fa6'
import { FaBusSimple } from 'react-icons/fa6'
import { BsLuggageFill } from 'react-icons/bs'
import { TbArrowsRightLeft } from 'react-icons/tb'
import { modals } from '@mantine/modals'
import { LoginForm } from '@/app/(frontend)/auth/login/_components/login-form'
import { Route } from 'next'
import { FiPhone } from 'react-icons/fi'
import { RiWhatsappFill } from 'react-icons/ri'
import { MdPhone } from 'react-icons/md'
import { useGetWidgetsByCollectionSlug } from '@/hooks/useCsmQuery'
import type { GlobalHeader } from '@/libs/payload'
import { CallFormDrawer } from '@/components/call-form/CallFormDrawer'
import NextImage from 'next/image'
import { SlEarphonesAlt } from 'react-icons/sl'
import { CiCircleInfo } from 'react-icons/ci'
import { CallForm } from './call-form'
import { Img } from '@react-email/components'

type HeaderProps = {
  headerContent?: GlobalHeader | null
}

export const Header: React.FC<HeaderProps> = ({ headerContent }) => {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const toggleDrawer = () => setDrawerOpened((prev) => !prev)
  const session = useSession()

  const widgets = useGetWidgetsByCollectionSlug()
  const headerData = widgets?.data?.find((item) => item.point === 'header')

  const [opened, { open, close }] = useDisclosure(false)
  const iconMap = {
    Otel: FaBed,
    Uçak: MdAirplanemodeActive,
    Araç: FaCar,
    Tur: BsLuggageFill,
    Otobüs: FaBusSimple,
    Transfer: TbArrowsRightLeft,
  } as const
  type IconKey = keyof typeof iconMap

  return (
    <>
      <header className='border-b bg-white'>
        <Container>
          <div className='grid items-center justify-between'>
            <div className='ms-auto mt-2 hidden items-center gap-5 text-sm font-medium md:flex'>
              <Link
                href='https://www.whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'
                className='flex items-center gap-1'
              >
                <div className='relative size-[40px]'>
                  <Img src={'/whatsapp-icon.jpg'} />
                </div>
                <div className='leading-sm text-xs text-black'>WhatsApp</div>
              </Link>
              <div
                className='flex cursor-pointer items-center gap-2 text-black'
                onClick={() => {
                  modals.open({
                    title: 'Sizi Arayalım',
                    children: <CallForm />,
                  })
                }}
              >
                <SlEarphonesAlt size={18} />
                Sizi Arayalım
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Box className='flex items-center pb-2'>
                <Link href='/'>
                  <Image
                    src='/logo.png'
                    width={188}
                    height={41}
                    alt='GeziBank'
                    priority
                  />
                </Link>
                <div className='hidden md:block'>
                  <HeaderMenu menuItems={headerContent?.menuItems} />
                </div>
                <Drawer opened={opened} onClose={close} className='md:hidden'>
                  <div className='flex flex-col gap-2'>
                    <div>
                      <PersonLetters />
                    </div>
                    <div className='rounded-md border p-2 shadow'>
                      <AccountSideNav insideClose={close} />
                    </div>
                  </div>
                </Drawer>
                <div className='ml-auto flex items-center gap-1 md:hidden'>
                  {session.status === 'authenticated' ? (
                    <Button
                      onClick={open}
                      className='rounded-full bg-blue-800 text-start text-xs font-medium text-white'
                    >
                      {session?.data.user.name
                        ? `${session.data.user.name}`
                        : ''}
                    </Button>
                  ) : (
                    <Button
                      variant='outline'
                      size='xs'
                      className='p-2'
                      radius={'xl'}
                      component={Link}
                      href={'/auth/login' as Route}
                    >
                      <FaUser />
                    </Button>
                  )}

                  <Burger
                    opened={drawerOpened}
                    onClick={toggleDrawer}
                    size='sm'
                    title='Menü Aç/Kapat'
                  />
                </div>
                <Drawer
                  opened={drawerOpened}
                  onClose={toggleDrawer}
                  padding='md'
                  styles={{
                    header: {
                      boxShadow: '0 0 2px 0 gray',
                    },
                  }}
                  title={
                    <div className='gap-lg flex items-center justify-end'>
                      <Link onClick={toggleDrawer} href='/'>
                        <Image
                          src='/logo.png'
                          width={118}
                          height={41}
                          alt='GeziBank'
                          priority
                        />
                      </Link>

                      <div>
                        {session.status === 'authenticated' ? (
                          <Button
                            variant='outline'
                            radius='xl'
                            onClick={toggleDrawer}
                            leftSection={<FaRegUserCircle />}
                            component={Link}
                            href={'/account' as Route}
                          >
                            <span className='block truncate text-xs font-medium'>
                              {session.data?.user.name}
                            </span>
                          </Button>
                        ) : (
                          <Button
                            variant='outline'
                            radius='xl'
                            leftSection={<FaRegUserCircle />}
                            component={Link}
                            onClick={toggleDrawer}
                            href={'/auth/login' as Route}
                            loading={session.status === 'loading'}
                          >
                            Giriş Yap
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                  size='sm'
                >
                  <div className='mt-4 flex flex-col gap-4'>
                    {headerData &&
                      headerData.params.main_menu.menus.map((item) => {
                        const IconComponent = iconMap[item.title as IconKey]
                        return (
                          <Anchor
                            className={
                              item.title == 'Kampanyalar'
                                ? 'border-t border-gray-400 pt-4'
                                : ''
                            }
                            onClick={toggleDrawer}
                            component={Link}
                            href={item.url as Route}
                            key={item.id}
                            c={'dark'}
                          >
                            {IconComponent && (
                              <IconComponent
                                size={18}
                                className='me-3 inline-block'
                              />
                            )}
                            {item.title}
                          </Anchor>
                        )
                      })}
                  </div>
                  <Grid gutter={'md'} className='mt-4'>
                    <Grid.Col span={12}>
                      <Anchor
                        component={Link}
                        onClick={toggleDrawer}
                        href='/online-operations'
                        c={'dark'}
                      >
                        Turunuzu Görüntüleyin
                      </Anchor>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Anchor
                        onClick={toggleDrawer}
                        component={Link}
                        href='/iletisim'
                        c={'dark'}
                      >
                        Yardım
                      </Anchor>
                    </Grid.Col>
                  </Grid>
                </Drawer>
              </Box>
            </div>
          </div>
          <div className='hidden items-center justify-between gap-5 md:grid ms-auto'>
            {session.status === 'authenticated' ? (
              <>
              <div className='absolute top-0 right-50 flex flex-col items-center gap-2'>
                <div className='relative w-full h-[58px]'>
                  <Image
                    src='/container-header.png'
                    alt='Header Container'
                    width={295}
                    height={285}
                    className='h-full object-cover object-top'
                    style={{ marginTop: '-0.5px' }}
                    priority
                  />
                  <div className='absolute top-2 left-1/2 border border-blue-600 rounded-full -translate-x-1/2 flex items-center gap-3 text-white'>
                    <Menu>
                      <Menu.Target>
                        <div
                          className='flex items-center gap-2 text-white cursor-pointer px-2 py-1 hover:text-blue-600'
                        >
                          <div>
                            <FaUser size={16} className='text-blue-600' />
                          </div>
                          <div className='hidden text-base font-medium md:block'>
                            {session.data?.user?.name}
                          </div>
                        </div>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>{session.data?.user?.name}</Menu.Label>
                        <Menu.Item component={Link} href={'/account' as Route}>
                          Hesabım
                        </Menu.Item>
                        <Menu.Item
                          onClick={async () => {
                            signOut()
                          }}
                          className='text-red-500'
                          leftSection={<IoIosLogOut size={18} />}
                        >
                          Oturumu Kapatın
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                </div>
                <Link
                      href='/iletisim'
                      className='flex items-center gap-1 text-sm font-medium text-gray-600'
                    >
                      <CiCircleInfo size={16} />
                      Yardım
                    </Link>
              </div>
              </>
            ) : (
              <div className='absolute top-0 right-50 flex flex-col items-center gap-2'>
                <div className='relative w-full h-[58px]'>
                  <Image
                    src='/container-header.png'
                    alt='Header Container'
                    width={295}
                    height={285}
                    className='h-full object-cover object-top'
                    style={{ marginTop: '-2px' }}
                    priority
                  />
                  <div className='absolute top-2 right-10 flex items-center gap-5'>
                    <button
                      className='flex cursor-pointer items-center font-medium text-white'
                      onClick={() => {
                        modals.open({
                          title: (
                            <Title order={2} className='text-center'>
                              Üye Girişi
                            </Title>
                          ),
                          children: <LoginForm />,
                        })
                      }}
                    >
                      <span className='flex items-center justify-center gap-1'>
                        <span className='flex h-5 w-5 items-center justify-center'>
                          {' '}
                          <FaRegUserCircle
                            size={19}
                            className='text-blue-600'
                          />{' '}
                        </span>
                        <span> Üye Girişi</span>
                      </span>
                    </button>
                    <Link
                      href='/auth/register'
                      className='flex items-center gap-1 rounded-md border border-blue-600 px-2 py-1 text-sm font-medium text-white'
                    >
                      <span className='flex h-5 w-5 items-center justify-center'>
                        <FaUserPlus size={19} className='text-blue-600' />
                      </span>
                      Kayıt Ol
                    </Link>
                  </div>
                </div>

                <Link
                  href='/iletisim'
                  className='flex items-center gap-1 text-sm font-medium text-gray-600'
                >
                  <CiCircleInfo size={16} />
                  Yardım
                </Link>
              </div>
            )}
          </div>
        </Container>
      </header>
    </>
  )
}

export default Header
