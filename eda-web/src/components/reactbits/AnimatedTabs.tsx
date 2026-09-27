import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: any) => void;
  className?: string;
  layoutIdPrefix?: string;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  layoutIdPrefix = 'nav',
}) => {
  return (
    <nav
      className={`relative flex items-center gap-1 p-1 bg-slate-200/40 dark:bg-white/[0.04] backdrop-blur-2xl rounded-full border border-slate-200/60 dark:border-white/10 overflow-x-auto max-w-full ${className}`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-colors duration-150 whitespace-nowrap flex-shrink-0 z-10 select-none ${
              isActive
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={`${layoutIdPrefix}-activePill`}
                className="absolute inset-0 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-white/10 -z-10"
                transition={{ type: 'spring', stiffness: 480, damping: 36 }}
              />
            )}
            <Icon
              className={`w-3.5 h-3.5 transition-colors ${
                isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
              }`}
              strokeWidth={1.8}
            />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-medium">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default AnimatedTabs;
