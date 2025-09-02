// ...existing code...
// Example Button component
import React from 'react';
import { cn } from '../../utils/cn';

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn('px-4 py-2 rounded bg-blue-600 text-white', props.className)} {...props}>
      {children}
    </button>
  );
}
// ...existing code...
