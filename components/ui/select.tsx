import React from 'react';
import { cn } from '../../utils/cn';

export function Select({ value, onChange, children, ...props }: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={cn('select', props.className)} {...props}>
      {children}
    </select>
  );
}
export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}
export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function SelectValue({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
