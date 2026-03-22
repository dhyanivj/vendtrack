import Link from 'next/link';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/', active: true },
    { name: 'Vendors', href: '/vendors' },
    { name: 'Orders', href: '/orders' },
    { name: 'Invoices', href: '/invoices' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-surface-container-low/80 backdrop-blur-[15px] border-r border-outline-variant/20 h-screen sticky top-0 flex flex-col pt-8 pb-4 px-4 shadow-[0_24px_48px_-12px_rgba(0,20,83,0.04)]">
      <div className="px-4 mb-10">
        <h1 className="text-2xl font-display font-medium text-on-surface tracking-tight">VendTrack</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-full text-sm font-medium transition-all ${
              item.active 
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-variant/50'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface">
            VD
          </div>
          <div className="text-sm font-medium text-on-surface-variant truncate">
            Vijay Dhyani
          </div>
        </div>
      </div>
    </aside>
  );
}
