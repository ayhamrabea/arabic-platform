'use client'

import Link from 'next/link'
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
} from '@heroicons/react/24/outline'
import Icon from './icon/Icon'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'

export default function Navbar() {
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

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
                <span className="font-bold text-xl text-gray-900">LingoLearn</span>
                <span className="text-xs text-indigo-600 font-medium ml-1">AI</span>
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
              Home
            </Link>
            
            <Link 
              href="/lessons" 
              className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Lessons
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Dashboard
            </Link>

            {user ? (
              <Menu as="div" className="relative ml-2">
                {({ open }) => (
                  <>
                    <MenuButton className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all border border-indigo-100">
                      <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                      <span className="font-medium">{user.email?.split('@')[0]}</span>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </MenuButton>
                    
                    <MenuItems className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 focus:outline-none">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="font-medium truncate">{user.email}</p>
                      </div>
                      
                      <MenuItem>
                        {({ active }) => (
                          <Link 
                            href="/profile" 
                            className={`${active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'} flex items-center px-4 py-3 transition-colors`}
                          >
                            <UserCircleIcon className="h-5 w-5 mr-3" />
                            Profile Settings
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
                            Settings
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
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow hover:shadow-md"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
                      <p className="text-sm text-gray-500">Welcome back</p>
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
                  Home
                </Link>
                
                <Link 
                  href="/lessons" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpenIcon className="h-5 w-5 mr-3" />
                  Lessons
                </Link>
                
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
                
                <Link 
                  href="/profile" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Profile Settings
                </Link>
                
                <Link 
                  href="/settings" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" name="settings" />
                  Settings
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
                  Home
                </Link>
                
                <Link 
                  href="/lessons" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpenIcon className="h-5 w-5 mr-3" />
                  Lessons
                </Link>
                
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
                
                <Link 
                  href="/login" 
                  className="block px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                
                <Link 
                  href="/register" 
                  className="block px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 text-center font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}