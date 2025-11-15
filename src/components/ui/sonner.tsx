"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: '#000000',
          border: '2px solid #fbbf24',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(251, 191, 36, 0.3)',
        },
        className: 'group toast group-[.toaster]:bg-black group-[.toaster]:text-white group-[.toaster]:border-[#fbbf24] group-[.toaster]:shadow-lg',
        descriptionClassName: 'group-[.toast]:text-gray-300',
        actionButtonStyle: {
          background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
          color: '#000000',
          fontWeight: 'bold',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
        },
      }}
      style={
        {
          "--normal-bg": "#000000",
          "--normal-text": "#ffffff",
          "--normal-border": "#fbbf24",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
