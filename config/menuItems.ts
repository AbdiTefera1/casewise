import { IconType } from 'react-icons';
import { 
  FaGripHorizontal, 
  FaGavel, 
  FaTasks, 
  FaUsers, 
  FaCalendar, 
  FaBalanceScale,
  FaChartLine,
  FaCog,
  FaBell,
  FaQuestionCircle
} from 'react-icons/fa';
import { UserRole } from '@prisma/client';

export interface MenuItem {
  id: string;
  icon: IconType;
  label: string;
  href: string;
  roles: UserRole[];
  subItems?: Omit<MenuItem, 'icon'>[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    icon: FaGripHorizontal,
    label: 'Dashboard',
    href: '/dashboard',
    roles: [UserRole.ADMIN, UserRole.LAWYER, UserRole.PARALEGAL]
  },
  {
    id: 'cases',
    icon: FaGavel,
    label: 'Cases',
    href: '/cases',
    roles: [UserRole.ADMIN, UserRole.LAWYER, UserRole.PARALEGAL],
  },
  {
    id: 'tasks',
    icon: FaTasks,
    label: 'Tasks',
    href: '/tasks',
    roles: [UserRole.ADMIN, UserRole.LAWYER, UserRole.PARALEGAL],
    subItems: [
      {
        id: 'all-tasks',
        label: 'All Tasks',
        href: '/tasks',
        roles: [UserRole.ADMIN, UserRole.LAWYER, UserRole.PARALEGAL]
      },
      {
        id: 'my-tasks',
        label: 'My Tasks',
        href: '/tasks/my-tasks',
        roles: [UserRole.ADMIN, UserRole.LAWYER, UserRole.PARALEGAL]
      },
      {
        id: 'create-task',
        label: 'Create New Task',
        href: '/tasks/create',
        roles: [UserRole.ADMIN, UserRole.LAWYER]
      }
    ]
  },
  {
    id: 'clients',
    icon: FaUsers,
    label: 'Clients',
    href: '/clients',
    roles: [UserRole.ADMIN, UserRole.LAWYER]
  },
  {
    id: 'appointment',
    icon: FaCalendar,
    label: 'Appointment',
    href: '/appointment',
    roles: [UserRole.ADMIN, UserRole.LAWYER, UserRole.PARALEGAL]
  },
  {
    id: 'lawyers',
    icon: FaBalanceScale,
    label: 'Lawyers',
    href: '/lawyers',
    roles: [UserRole.ADMIN]
  },
  {
    id: 'reports',
    icon: FaChartLine,
    label: 'Reports',
    href: '/reports',
    roles: [UserRole.ADMIN, UserRole.LAWYER]
  },
  {
    id: 'settings',
    icon: FaCog,
    label: 'Settings',
    href: '/settings',
    roles: [UserRole.ADMIN]
  },
  {
    id: 'notifications',
    icon: FaBell,
    label: 'Notifications',
    href: '/notifications',
    roles: [UserRole.ADMIN, UserRole.LAWYER, UserRole.PARALEGAL]
  },
  {
    id: 'support',
    icon: FaQuestionCircle,
    label: 'Support',
    href: '/support',
    roles: [UserRole.ADMIN, UserRole.LAWYER, UserRole.PARALEGAL]
  }
];