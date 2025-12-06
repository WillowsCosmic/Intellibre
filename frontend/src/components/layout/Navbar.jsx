import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProfileDropdown from './ProfileDropdown'
import { Menu, X, BookOpen, LogOut } from "lucide-react"
import { Button } from '../ui/button'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const navLinks = [
    { name: "Features", href: "#features" },
    
  ]

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false)
      }
    };
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [profileDropdownOpen])

  return (
    <header className="bg-[#faf7f3] border-b border-[#e8e0d5]">
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <a href="/" className='flex items-center space-x-2.5 group'>
            <div className="w-9 h-9 bg-linear-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/40 transition-all duration-300 group-hover:scale-110">
              <BookOpen className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-semibold text-[#3d2f1f] tracking-tight'>
              Intellibre
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center space-x-1'>
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className='px-4 py-2 text-sm font-medium text-[#6b5d4f] hover:text-teal-600 rounded-lg hover:bg-teal-50/50 transition-all'
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ""}
                companyName={user?.name || ""}
                email={user?.email || ""}
                userRole={user?.role || ""}
                onLogout={logout}
              />
            ) : (
              <>
                <a
                  href="/login"
                  className='px-4 py-2 text-sm font-medium text-[#6b5d4f] hover:text-[#3d2f1f] rounded-lg hover:bg-[#f5f1eb] transition-all'
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className='px-5 py-2 text-sm font-medium text-white bg-linear-to-br from-teal-500 to-cyan-600 rounded-lg hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-200 hover:scale-105'
                >
                  Get Started
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-[#6b5d4f] hover:bg-[#f5f1eb] transition-all duration-200"
            variant="ghost"
            size="icon"
          >
            {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='lg:hidden bg-[#faf7f3] border-t border-[#e8e0d5] animate-in slide-in-from-top duration-200'>
          {/* Mobile Navigation Links */}
          <nav className='px-4 py-4 space-y-1'>
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className='block px-4 py-2.5 text-sm font-medium text-[#6b5d4f] hover:text-teal-600 rounded-lg hover:bg-teal-50/50 transition-all'
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Auth Section */}
          <div className='px-4 py-4 border-t border-[#e8e0d5]'>
            {isAuthenticated ? (
              <div className='space-y-3'>
                {/* User Info */}
                <div className="flex items-center space-x-3 px-2">
                  <div className="h-10 w-10 bg-linear-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#3d2f1f] truncate">
                      {user?.name}
                    </div>
                    <div className="text-xs text-[#8b7d6f] truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <Button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  variant="ghost"
                >
                  <LogOut className='w-4 h-4' />
                  <span>Sign out</span>
                </Button>
              </div>
            ) : (
              <div className='space-y-2'>
                <a
                  href="/login"
                  className='block px-4 py-2.5 text-center text-sm font-medium text-[#6b5d4f] hover:text-[#3d2f1f] rounded-lg hover:bg-[#f5f1eb] transition-all duration-150'
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className='block text-center px-4 py-2.5 text-sm font-medium text-white bg-linear-to-br from-teal-500 to-cyan-600 rounded-lg hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-200'
                >
                  Get Started
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar