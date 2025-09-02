// Example Tabs component
import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export function Tabs({ children }: { children: React.ReactNode }) {
  return <div className={cn('tabs')}>{children}</div>;
}
export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className={cn('tabs-list')}>{children}</div>;
}
export function TabsTrigger({ children, value, onClick }: { children: React.ReactNode; value: string; onClick?: () => void }) {
  return (
    <button className={cn('tabs-trigger')} onClick={onClick}>
      {children}
    </button>
  );
}
export function TabsContent({ children, value }: { children: React.ReactNode; value: string }) {
  return <div className={cn('tabs-content')}>{children}</div>;
}