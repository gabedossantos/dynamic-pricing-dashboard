import React from 'react';
import { cn } from '../../utils/cn';

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className={cn('tabs-list')}>{children}</div>;
}
