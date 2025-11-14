import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PoliceButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: LucideIcon;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function PoliceButton({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  type = 'button',
  disabled = false,
  className = '',
}: PoliceButtonProps) {
  const baseStyles = 'px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium tracking-wide';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:from-[#fcd34d] hover:to-[#fbbf24] shadow-lg hover:shadow-xl hover:shadow-[#fbbf24]/30 hover:scale-105 active:scale-100',
    secondary: 'bg-gradient-to-r from-[#2a2a2a] to-[#1f1f1f] text-white hover:from-[#3a3a3a] hover:to-[#2a2a2a] border-2 border-[#3a3a3a] hover:border-[#fbbf24]/50 shadow-md hover:shadow-lg',
    danger: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white hover:from-[#f87171] hover:to-[#ef4444] shadow-lg hover:shadow-xl hover:shadow-[#ef4444]/30 hover:scale-105 active:scale-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}