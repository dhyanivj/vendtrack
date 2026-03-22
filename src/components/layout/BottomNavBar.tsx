'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavBar() {
  const pathname = usePathname();
  if (['/login', '/signup'].includes(pathname)) return null;

  const tabs = [
    { name: 'Dashboard', icon: 'dashboard', href: '/' },
    { name: 'Add', icon: 'add_circle', href: '/add', fillIcon: true },
    { name: 'History', icon: 'history', href: '/history' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-gray-100 rounded-t-2xl">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center justify-center px-4 py-1 transition-all active:scale-90 duration-150 rounded-xl ${
              isActive
                ? 'text-[#a73a00] bg-[#f3f3f3]'
                : 'text-gray-400 hover:text-[#ff5c00]'
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              data-icon={tab.icon}
              style={tab.fillIcon && isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
