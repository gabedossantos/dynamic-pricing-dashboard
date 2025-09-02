import React from 'react';
import { cn } from '../../utils/cn';

export function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('label', props.className)} {...props}>{children}</label>;
}
