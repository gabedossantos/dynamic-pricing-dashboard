import React from 'react';
import { cn } from '../../utils/cn';

export function Slider({ value, onChange, min = 0, max = 100, step = 1, ...props }: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      className={cn('slider', props.className)}
      {...props}
    />
  );
}
