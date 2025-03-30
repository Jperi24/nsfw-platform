// components/Header.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === 'admin';
  const isPremium = session?.user?.membershipStatus === 'premium';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            ContentPlatform
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              href="/browse"
              className={`hover:text-blue-400 ${
                pathname.startsWith('/browse') ? 'text-blue-400' : ''
              }`}
            >
              Browse
            </Link>
            <Link
              href="/models"
              className={`hover:text-blue-400 ${
                pathname.startsWith('/models') ? 'text-blue-400' : ''
              }`}
            >
              Models
            </Link>
            
            {!isPremium && (
              <Link
                href="/membership"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-blue-600"
              >
                Upgrade
              </Link>
            )}
            
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`hover:text-blue-400 ${
                  pathname.startsWith('/admin') ? 'text-blue-400' : ''
                }`}
              >
                Admin
              </Link>
            )}
            
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-blue-400">
                  <span>{session.user.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    href="/account/profile"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  {isPremium && (
                    <Link
                      href="/account/subscription"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Subscription
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="hover:text-blue-400"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <Link
              href="/browse"
              className="block hover:text-blue-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/models"
              className="block hover:text-blue-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Models
            </Link>
            
            {!isPremium && (
              <Link
                href="/membership"
                className="block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Upgrade
              </Link>
            )}
            
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block hover:text-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            {session ? (
              <div className="space-y-2">
                <div className="font-medium">{session.user.name}</div>
                <Link
                  href="/account/profile"
                  className="block hover:text-blue-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {isPremium && (
                  <Link
                    href="/account/subscription"
                    className="block hover:text-blue-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Subscription
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  className="block hover:text-blue-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block hover:text-blue-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}