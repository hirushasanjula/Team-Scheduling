'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { RxDashboard } from "react-icons/rx";
import { 
  Clock, 
  Menu, 
  X, 
  Home, 
  Calendar, 
  Users, 
  Timer, 
  Building2, 
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't run on server
    
    let isCancelled = false;
    
    const fetchUser = async () => {
      try {
        console.log('Navbar - Fetching user data...');
        
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          // Add a timeout to prevent hanging requests
        });

        if (isCancelled) return; // Don't update state if component unmounted
        
        console.log('Navbar - Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Navbar - User data received:', data);
          
          if (data.user && !isCancelled) {
            setUser(data.user);
          } else if (!isCancelled) {
            setUser(null);
          }
        } else if (!isCancelled) {
          console.log('Navbar - Response not OK:', response.status);
          setUser(null);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Navbar - Error fetching user:', error);
          setUser(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
    
    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [mounted]); // Only depend on mounted state

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
      router.push('/login');
    }
  };

  // Don't render anything on server-side or while mounting
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  Team Scheduling
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Don't render if no user or unauthorized role
  if (!user || (user.role !== 'EMPLOYEE' && user.role !== 'MANAGER')) {
    console.log('Navbar - Not rendering: user =', user, 'role =', user?.role);
    return null;
  }

  console.log('Navbar - Rendering for user:', user.name, 'role:', user.role);

  const navigation = [
    { name: 'Home', href: '/', icon: Home, show: true },
    { name: 'Dashboard', href: '/dashboard', icon: RxDashboard, show: true },
    { name: 'Shifts', href: '/shifts', icon: Calendar, show: true },
    { name: 'Time Tracking', href: '/time-tracking', icon: Timer, show: true },
    { name: 'Employees', href: '/employees', icon: Users, show: user?.role === 'MANAGER' },
    { name: 'Company', href: '/company', icon: Building2, show: user?.role === 'MANAGER' },
  ];

  const authLinks = [
    { name: 'Login', href: '/login', show: !user },
    { name: 'Register', href: '/register', show: !user },
  ];

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Team Scheduling
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {navigation.filter(item => item.show).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              {authLinks.filter(item => item.show).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  {item.name === 'Login' ? (
                    <span className="text-gray-700 hover:text-blue-600">Login</span>
                  ) : (
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700">
                      Register
                    </span>
                  )}
                </Link>
              ))}
            </div>
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.companyName} • {user.role}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {user.companyName} • {user.role}
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile Settings
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navigation.filter(item => item.show).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              {authLinks.filter(item => item.show).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-3 rounded-lg font-medium transition-all ${
                    item.name === 'Login' ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center hover:from-blue-600 hover:to-purple-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.companyName} • {user.role}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mt-2"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}
    </>
  );
}