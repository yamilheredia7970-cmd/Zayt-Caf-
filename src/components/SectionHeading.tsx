import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignClass =
    align === 'center'
      ? 'text-center mx-auto'
      : 'text-start';

  return (
    <div className={`max-w-2xl mb-12 sm:mb-16 ${alignClass} ${className}`}>
      {kicker && (
        <span className="block text-xs font-semibold tracking-wider uppercase text-[#9E471D] mb-2.5">
          {kicker}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.15] text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
};
