'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { LogoutButton } from './Logout'
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
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Icon from './icon/Icon'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'

// استيراد من next-intl - الطريقة الصحيحة
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

import Link from 'next/link'

export default function Navbar() {
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // استخدام next-intl hooks
  const t = useTranslations('Navbar')
  const tGeneral = useTranslations('General')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const changeLanguage = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.replace(segments.join('/'))
  }


  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </div>
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
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">{tGeneral('logo')}</span>
                <span className="text-xs text-indigo-600 font-medium ml-1">{tGeneral('logoAI')}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              {t('home')}
            </Link>
            
            <Link 
              href="/lessons" 
              className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              {t('lessons')}
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              {t('dashboard')}
            </Link>

            {/* رابط المفضلة - يظهر فقط للمستخدمين المسجلين */}
            {user && (
              <Link 
                href="/favorites" 
                className="flex items-center px-4 py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all relative group"
              >
                <HeartIcon className="h-5 w-5 mr-2 group-hover:hidden" />
                <HeartIconSolid className="h-5 w-5 mr-2 hidden group-hover:block text-rose-500" />
                {t('favorites')}
                {/* مؤشر صغير للإشعارات (اختياري) */}
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-rose-500 rounded-full animate-pulse"></span>
              </Link>
            )}

            {/* Language Switcher */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  {languageOptions.find(lang => lang.code === locale)?.flag}
                </span>
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

            {user ? (
              <Menu as="div" className="relative ml-2">
                {({ open }) => (
                  <>
                    <MenuButton className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all border border-indigo-100">
                      <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                      <span className="font-medium">{user.email?.split('@')[0]}</span>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </MenuButton>
                    
                    <MenuItems className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 focus:outline-none z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">{t('signedInAs')}</p>
                        <p className="font-medium truncate">{user.email}</p>
                      </div>
                      
                      <MenuItem>
                        {({ active }) => (
                          <Link 
                            href="/profile" 
                            className={`${active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'} flex items-center px-4 py-3 transition-colors`}
                          >
                            <UserCircleIcon className="h-5 w-5 mr-3" />
                            {t('profile')}
                          </Link>
                        )}
                      </MenuItem>
                      
                      <MenuItem>
                        {({ active }) => (
                          <Link 
                            href="/favorites" 
                            className={`${active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'} flex items-center px-4 py-3 transition-colors`}
                          >
                            <HeartIcon className="h-5 w-5 mr-3" />
                            {t('myFavorites')}
                          </Link>
                        )}
                      </MenuItem>
                      
                      <MenuItem>
                        {({ active }) => (
                          <Link 
                            href="/settings" 
                            className={`${active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'} flex items-center px-4 py-3 transition-colors`}
                          >
                            <Icon className="h-5 w-5 mr-3" name="settings" />
                            {t('settings')}
                          </Link>
                        )}
                      </MenuItem>
                      
                      <div className="px-4 py-3 border-t border-gray-100">
                        <LogoutButton variant="menu" />
                      </div>
                    </MenuItems>
                  </>
                )}
              </Menu>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link 
                  href="/login" 
                  className="px-6 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow hover:shadow-md"
                >
                  {t('getStarted')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language switcher for mobile */}
            <Menu as="div" className="relative">
              <MenuButton className="p-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                <span className="text-lg">
                  {languageOptions.find(lang => lang.code === locale)?.flag}
                </span>
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

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 pt-4 pb-6 animate-in slide-in-from-top duration-200">
            {user ? (
              <div className="space-y-2">
                <div className="px-4 pb-4 border-b">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg mr-3">
                      <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('welcomeBack')}</p>
                      <p className="font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HomeIcon className="h-5 w-5 mr-3" />
                  {t('home')}
                </Link>
                
                <Link 
                  href="/lessons" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpenIcon className="h-5 w-5 mr-3" />
                  {t('lessons')}
                </Link>
                
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  {t('dashboard')}
                </Link>
                
                {/* رابط المفضلة في الموبايل */}
                <Link 
                  href="/favorites" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HeartIcon className="h-5 w-5 mr-3" />
                  {t('myFavorites')}
                </Link>
                
                <Link 
                  href="/profile" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  {t('profile')}
                </Link>
                
                <Link 
                  href="/settings" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" name="settings" />
                  {t('settings')}
                </Link>

                <div className="pt-4 border-t">
                  <div className="px-4">
                    <LogoutButton variant="mobile" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Link 
                  href="/" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HomeIcon className="h-5 w-5 mr-3" />
                  {t('home')}
                </Link>
                
                <Link 
                  href="/lessons" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpenIcon className="h-5 w-5 mr-3" />
                  {t('lessons')}
                </Link>
                
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  {t('dashboard')}
                </Link>
                
                <Link 
                  href="/login" 
                  className="block px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('signIn')}
                </Link>
                
                <Link 
                  href="/register" 
                  className="block px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 text-center font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('getStarted')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}