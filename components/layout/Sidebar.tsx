"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/zustand/auth';
import { MENU_ITEMS, MenuItem } from '@/config/menuItems';
import { UserRole } from '@prisma/client';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface SidebarProps {
  isMenuOpen: boolean;
  
}

const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen }) => {
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
            flex items-center justify-between px-1 py-3 cursor-pointer
            ${
              isItemActive
                ? 'bg-navy-700 text-white dark:bg-gray-700 dark:text-gray-200'
                : 'text-gray-300 hover:bg-navy-800 dark:hover:bg-gray-600'
            }
            rounded-lg transition-colors duration-150
          `}
          onClick={() => hasSubItems ? toggleExpand(item.id) : null}
        >
          <Link
            href={item.href}
            className="flex items-center flex-1 gap-3"
            onClick={(e) => hasSubItems && e.preventDefault()}
          >
            <span><item.icon size={24}/></span>
            {isMenuOpen && <span className="text-sm">{item.label}</span>}
          </Link>
          {isMenuOpen && hasSubItems && (
            isExpanded ? (
              <FaChevronDown className="w-3 h-3" />
            ) : (
              <FaChevronRight className="w-3 h-3" />
            )
          )}
        </div>

        {isMenuOpen && hasSubItems && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.subItems!.map(subItem => (
              <Link
                key={subItem.id}
                href={subItem.href}
                className={`
                  block px-4 py-2 rounded-lg text-sm
                  ${
                    isActive(subItem.href)
                      ? 'bg-navy-700 text-white dark:bg-gray-700 dark:text-gray-200'
                      : 'text-gray-300 hover:bg-navy-800 dark:hover:bg-gray-600'
                  }
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
    <aside
      className={`
        h-screen bg-navy-900 dark:bg-gray-800 text-white flex flex-col fixed left-0 top-20
        transition-all duration-300 ${isMenuOpen ? 'w-64' : 'w-16'}
      `}
    >
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {authorizedItems.map(renderMenuItem)}
      </nav>
    </aside>
  );
};

export default Sidebar;