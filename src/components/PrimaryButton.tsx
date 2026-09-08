import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: 'primary' | 'secondary' };

export default function PrimaryButton({ children, variant = 'primary', className = '', ...props }: PrimaryButtonProps) {
  return <button className={`primary-button ${variant === 'secondary' ? 'secondary-button' : ''} ${className}`} {...props}>{children}</button>;
}
