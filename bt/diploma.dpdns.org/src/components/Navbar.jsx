import React, { Fragment, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, GlobeIcon } from '@heroicons/react/24/outline';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const location = useLocation();

  // 导航链接
  const navigation = [
    { name: 'home', href: '/' },
    { name: 'courses', href: '/courses' },
    { name: 'about', href: '/about' },
    { name: 'contact', href: '/contact' },
  ];

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 语言切换
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setLanguageMenuOpen(false);
  };

  return (
    <Disclosure
      as="nav"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#003087] shadow-md' : 'bg-[#003087]'
      }`}
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo 和品牌名 */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <img className="h-10 w-auto" src="/logo.png" alt="University Logo" />
                  <span className="ml-2 text-xl font-bold text-white">SIU</span>
                </Link>
              </div>

              {/* 桌面端导航链接 */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map(item => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      end={item.href === '/'}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-[#002266] text-white px-3 py-2 rounded-md text-sm font-bold'
                          : 'text-white hover:bg-[#002266] hover:text-white px-3 py-2 rounded-md text-sm font-bold'
                      }
                    >
                      {t(`header.${item.name}`)}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* 右侧功能区 */}
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* 语言切换按钮 */}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-[#002266] text-white flex items-center p-1 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                        <span className="sr-only">{t('navbar.changeLanguage')}</span>
                        <GlobeIcon className="h-6 w-6" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-900`}
                              onClick={() => changeLanguage('en')}
                            >
                              English
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-900`}
                              onClick={() => changeLanguage('zh')}
                            >
                              中文
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              {/* 移动端菜单按钮 */}
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="bg-[#002266] inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">{t('navbar.openMenu')}</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* 移动端菜单 */}
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map(item => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-[#002266] text-white block px-3 py-2 rounded-md text-base font-bold'
                      : 'text-white hover:bg-[#002266] hover:text-white block px-3 py-2 rounded-md text-base font-bold'
                  }
                >
                  {t(`header.${item.name}`)}
                </NavLink>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-blue-800">
              <div className="px-2 space-y-1">
                {/* 移动端的语言切换 */}
                <div className="px-3 py-2 rounded-md text-white font-medium">
                  <span className="block text-sm font-bold mb-1">{t('navbar.changeLanguage')}</span>
                  <div className="flex space-x-2">
                    <button
                      className="bg-[#002266] px-3 py-1 rounded text-white hover:bg-blue-700 focus:outline-none text-sm font-bold"
                      onClick={() => changeLanguage('en')}
                    >
                      English
                    </button>
                    <button
                      className="bg-[#002266] px-3 py-1 rounded text-white hover:bg-blue-700 focus:outline-none text-sm font-bold"
                      onClick={() => changeLanguage('zh')}
                    >
                      中文
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
