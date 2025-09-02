import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('badge', props.className)} {...props}>{children}</span>;
}
