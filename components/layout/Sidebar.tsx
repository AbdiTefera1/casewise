"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/zustand/auth';
import { MENU_ITEMS, MenuItem } from '@/config/menuItems';
import { UserRole } from '@prisma/client';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  if (!user) return null;

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const authorizedItems = MENU_ITEMS.filter(item => {
    const role = user.role as UserRole;
    return item.roles.includes(role);
  });

  const isActive = (href: string) => pathname === href;

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isItemActive = isActive(item.href) || 
      (item.subItems?.some(subItem => isActive(subItem.href)));

    return (
      <div key={item.id}>
        <div
          className={`
            flex items-center justify-between px-4 py-3 cursor-pointer
            ${isItemActive ? 'bg-navy-700 text-white' : 'text-gray-300 hover:bg-navy-800'}
            rounded-lg transition-colors duration-150
          `}
          onClick={() => hasSubItems ? toggleExpand(item.id) : null}
        >
          <Link
            href={item.href}
            className="flex items-center flex-1 gap-3"
            onClick={(e) => hasSubItems && e.preventDefault()}
          >
            <span className="text-sm">{item.label}</span>
          </Link>
          {hasSubItems && (
            isExpanded ? (
              <FaChevronDown className="w-3 h-3" />
            ) : (
              <FaChevronRight className="w-3 h-3" />
            )
          )}
        </div>

        {hasSubItems && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.subItems!.map(subItem => (
              <Link
                key={subItem.id}
                href={subItem.href}
                className={`
                  block px-4 py-2 rounded-lg text-sm
                  ${isActive(subItem.href) 
                    ? 'bg-navy-700 text-white' 
                    : 'text-gray-300 hover:bg-navy-800'}
                `}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 h-screen bg-navy-900 text-white flex flex-col fixed left-0 top-0">

      <div className="p-4 border-b border-navy-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <span className="text-xl text-white font-bold">Casewise</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {authorizedItems.map(renderMenuItem)}
      </nav>

      <div className="p-4 border-t border-navy-700">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <p className="font-medium text-sm text-white">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;