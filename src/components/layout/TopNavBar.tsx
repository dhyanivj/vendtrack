'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNavBar() {
  const pathname = usePathname();
  if (['/login', '/signup'].includes(pathname)) return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary" data-icon="account_circle" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_circle
            </span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#a73a00] dark:text-[#ff5c00]">
            VendTrack
          </span>
        </div>
        <Link href="/settings" className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 duration-200 text-[#a73a00]">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
        </Link>
      </div>
      <div className="h-[1px] w-full"></div>
    </header>
  );
}
