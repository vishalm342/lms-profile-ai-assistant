"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Globe, LogOut } from "lucide-react";

const KalviumLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#4F46E5" />
    <path d="M9 29V25L11 23V17L9 15V11H11V13H13V11H15V13H17V11H19V15L17 17V18H23V17L21 15V11H23V13H25V11H27V13H29V11H31V15L29 17V23L31 25V29H22V26C22 25.45 21.8042 24.9792 21.4125 24.5875C21.0208 24.1958 20.55 24 20 24C19.45 24 18.9792 24.1958 18.5875 24.5875C18.1958 24.9792 18 25.45 18 26V29H9ZM11 27H16V26C16 24.9 16.3917 23.9583 17.175 23.175C17.9583 22.3917 18.9 22 20 22C21.1 22 22.0417 22.3917 22.825 23.175C23.6083 23.9583 24 24.9 24 26V27H29V25.825L27 23.825V16.175L28.175 15H23.825L25 16.175V20H15V16.175L16.175 15H11.825L13 16.175V23.825L11 25.825V27Z" fill="white" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Initialize empty (matches SSR) — hydrate from localStorage after mount
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  const isHome = pathname === '/';

  useEffect(() => {
    function hydrateFromStorage() {
      setUserName(localStorage.getItem('studentName') || '');
      setUserId(localStorage.getItem('studentId') || '');
    }
    hydrateFromStorage();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <nav className={`sticky top-0 z-50 px-8 py-4 flex justify-between items-center w-full transition-colors duration-300 bg-white border-b border-gray-100`}>
      {/* Left — Brand */}
      <div className="flex items-center">
        <KalviumLogo />
        <span className="text-xl font-bold tracking-tight ml-3 text-gray-900">Kalvium Forge</span>
      </div>

      {/* Right — path-aware */}
      {pathname === '/login' && (
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
            Help Center
          </span>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </button>
        </div>
      )}

      {pathname === '/dashboard' && (
        <div className="flex items-center">
          <div className="text-right mr-4">
            <p className="text-sm font-bold text-gray-900 leading-tight">{userName || 'Student'}</p>
            <p className="text-xs text-gray-500 font-medium">Student ID: #KF{userId || '0000'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center mr-6">
            <span className="text-orange-700 font-bold text-sm">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div className="h-8 w-px bg-gray-200 mr-6"></div>
          <button
            onClick={handleLogout}
            className="flex items-center text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}

      {pathname === '/' && (
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 mr-2 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
