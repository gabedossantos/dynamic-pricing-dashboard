// Utility function for conditional class names
export function cn(...args: any[]): string {
  return args.filter(Boolean).join(' ');
}
