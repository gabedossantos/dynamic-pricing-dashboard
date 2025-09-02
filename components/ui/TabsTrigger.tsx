import React from 'react';
import { cn } from '../../utils/cn';

export function TabsTrigger({ children, value, onClick }: { children: React.ReactNode; value: string; onClick?: () => void }) {
  return (
    <button className={cn('tabs-trigger')} onClick={onClick}>
      {children}
    </button>
  );
}
