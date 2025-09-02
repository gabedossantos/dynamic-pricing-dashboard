import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card', props.className)} {...props}>{children}</div>;
}
export function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card-content', props.className)} {...props}>{children}</div>;
}
export function CardHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card-header', props.className)} {...props}>{children}</div>;
}
export function CardTitle({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <h3 className={cn('card-title', props.className)} {...props}>{children}</h3>;
}
