'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Tab {
  label: string;
  href: string;
  roles?: string[];
}

interface TabNavigationProps {
  tabs: Tab[];
  className?: string;
}

export default function TabNavigation({ tabs, className = '' }: TabNavigationProps) {
  const pathname = usePathname();

  return (
    <div className={`border-b ${className}`}>
      <nav className="container flex space-x-8 px-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium
                ${isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}