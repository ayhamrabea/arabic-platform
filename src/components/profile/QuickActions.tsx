// components/profile/QuickActions.tsx
import Link from 'next/link';
import Icon from '../icon/Icon';

interface QuickActionItem {
  href: string;
  iconName: string;
  label: string;
}

interface QuickActionsProps {
  t: (key: string, params?: Record<string, any>) => string;
  actions?: QuickActionItem[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  t, 
  actions 
}) => {
  const defaultActions: QuickActionItem[] = [
    {
      href: '/settings',
      iconName: 'settings',
      label: t('quickActions.settings')
    },
    {
      href: '/achievements',
      iconName: 'achievement',
      label: t('quickActions.achievements')
    },
    {
      href: '/Leaderboard',
      iconName: 'Leaderboard',
      label: t('quickActions.leaderboard')
    }
  ];

  const actionItems = actions || defaultActions;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {t('quickActions.title')}
      </h3>
      <div className="space-y-3">
        {actionItems.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center p-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group"
          >
            <Icon 
              className="h-5 w-5 mr-3 text-gray-500 group-hover:text-indigo-600" 
              name={action.iconName} 
            />
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
};