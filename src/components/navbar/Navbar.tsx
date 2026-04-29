'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

import { Link } from '@/i18n/navigation'
import { LogoutButton } from '../Logout'

export default function Navbar() {
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const t = useTranslations('Navbar')
  const tGeneral = useTranslations('General')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const changeLanguage = (newLocale: string) => {
    router.replace(`/${newLocale}${pathname.replace(/^\/(en|ru|ar)/, '')}`)
  }

  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  // الروابط العامة (تظهر للجميع)
    const publicLinks = [
      // { href: '/', icon: HomeIcon, key: 'home', color: 'indigo' },
      { href: '/lessons', icon: BookOpenIcon, key: 'lessons', color: 'indigo' },
      { href: '/quizzes', icon: QuestionMarkCircleIcon, key: 'quizzes', color: 'indigo' },
      { href: '/about', icon: InformationCircleIcon, key: 'about', color: 'indigo' },
      { href: '/pricing', icon: CreditCardIcon, key: 'pricing', color: 'indigo' },
    ]

    // الروابط الخاصة (تظهر فقط للمستخدمين المسجلين)
    const privateLinks = [
      { href: '/dashboard', icon: ChartBarIcon, key: 'dashboard', color: 'indigo' },
      { href: '/favorites', icon: HeartIcon, key: 'favorites', solidIcon: HeartIconSolid, color: 'rose' },
    ]

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group" onClick={() => setIsMenuOpen(false)}>
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {tGeneral('logo')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* الروابط العامة */}
            {publicLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {t(link.key)}
                </Link>
              )
            })}

            {/* الروابط الخاصة (للمستخدمين فقط) */}
            {user && privateLinks.map((link) => {
              const Icon = link.icon
              const SolidIcon = link.solidIcon
              const colorClass = link.color === 'rose' ? 'hover:text-rose-600 hover:bg-rose-50' : 'hover:text-indigo-600 hover:bg-indigo-50'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 text-gray-700 ${colorClass} rounded-lg transition-all group`}
                >
                  {SolidIcon ? (
                    <>
                      <Icon className="h-5 w-5 mr-2 group-hover:hidden" />
                      <SolidIcon className="h-5 w-5 mr-2 hidden group-hover:block text-rose-500" />
                    </>
                  ) : (
                    <Icon className="h-5 w-5 mr-2" />
                  )}
                  {t(link.key)}
                </Link>
              )
            })}

            {/* Language Switcher */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                <span className="text-lg">{languageOptions.find(lang => lang.code === locale)?.flag}</span>
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.code}>
                    {({ active }) => (
                      <button
                        onClick={() => changeLanguage(lang.code)}
                        className={`${active ? 'bg-gray-50' : ''} ${locale === lang.code ? 'text-indigo-600 font-medium' : 'text-gray-700'} w-full flex items-center px-4 py-2 text-sm transition-colors`}
                      >
                        <span className="mr-2 text-lg">{lang.flag}</span>
                        {lang.name}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            {/* User Menu or Auth Buttons */}
            {user ? (
              <Menu as="div" className="relative ml-2">
                {({ open }) => (
                  <>
                    <MenuButton className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all border border-indigo-100">
                      <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                      <span className="font-medium max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </MenuButton>
                    
                    <MenuItems className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">{t('signedInAs')}</p>
                        <p className="font-medium truncate text-sm">{user.email}</p>
                      </div>
                      
                      <MenuItem>
                        {({ active }) => (
                          <Link href="/profile" className={`${active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'} flex items-center px-4 py-2.5 transition-colors`}>
                            <UserCircleIcon className="h-5 w-5 mr-3" />
                            {t('profile')}
                          </Link>
                        )}
                      </MenuItem>
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <div className="px-4 py-2">
                          <LogoutButton variant="menu" />
                        </div>
                      </div>
                    </MenuItems>
                  </>
                )}
              </Menu>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link href="/login" className="px-5 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  {t('signIn')}
                </Link>
                <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-sm hover:shadow-md">
                  {t('getStarted')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Menu as="div" className="relative">
              <MenuButton className="p-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                <span className="text-lg">{languageOptions.find(lang => lang.code === locale)?.flag}</span>
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.code}>
                    {({ active }) => (
                      <button
                        onClick={() => changeLanguage(lang.code)}
                        className={`${active ? 'bg-gray-50' : ''} ${locale === lang.code ? 'text-indigo-600 font-medium' : 'text-gray-700'} w-full flex items-center px-4 py-2 text-sm`}
                      >
                        <span className="mr-2 text-lg">{lang.flag}</span>
                        {lang.name}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Simplified */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 pt-4 pb-6">
            {user ? (
              <div className="space-y-1">
                {/* User info */}
                <div className="px-4 pb-4 mb-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg mr-3">
                      <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('signedInAs')}</p>
                      <p className="font-medium text-sm truncate max-w-[200px]">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* All mobile links */}
                {[...publicLinks, ...privateLinks].map((link) => {
                  const Icon = link.icon
                  const colorClass = link.color === 'rose' ? 'hover:text-rose-600 hover:bg-rose-50' : 'hover:text-indigo-600 hover:bg-indigo-50'
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center px-4 py-3 text-gray-700 ${colorClass} rounded-lg transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {t(link.key)}
                    </Link>
                  )
                })}

                <div className="pt-4 mt-2 border-t border-gray-100">
                  <div className="px-4">
                    <LogoutButton variant="mobile" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Public mobile links */}
                {publicLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {t(link.key)}
                    </Link>
                  )
                })}

                <div className="pt-4 mt-2 border-t border-gray-100">
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-gray-700 hover:text-indigo-600 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('signIn')}
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-3 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('getStarted')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}