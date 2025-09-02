import React from 'react';
import { cn } from '../../utils/cn';

export function TabsContent({ children, value }: { children: React.ReactNode; value: string }) {
  return <div className={cn('tabs-content')}>{children}</div>;
}
