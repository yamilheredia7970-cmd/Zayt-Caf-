import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

interface ButtonAsButtonProps
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: never;
}

interface ButtonAsAnchorProps
  extends ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon,
  iconPosition = 'end',
  href,
  ...rest
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#9E471D] hover:bg-[#853A15] text-white shadow-xs focus-visible:outline-[#9E471D]',
    secondary:
      'bg-[#4A5844] hover:bg-[#3D4938] text-white shadow-xs focus-visible:outline-[#4A5844]',
    outline:
      'border border-stone-300 hover:border-stone-400 bg-transparent hover:bg-stone-100/60 text-stone-800 focus-visible:outline-stone-500',
    whatsapp:
      'bg-[#25D366] hover:bg-[#20BD5A] text-stone-950 font-semibold shadow-xs focus-visible:outline-[#25D366]',
    ghost:
      'bg-transparent hover:bg-stone-200/50 text-stone-700 hover:text-stone-900',
  }[variant];

  const content = (
    <>
      {icon && iconPosition === 'start' && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'end' && (
        <span className="shrink-0 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  if (href !== undefined) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        className={`group ${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={`group ${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...buttonProps}
    >
      {content}
    </button>
  );
};
