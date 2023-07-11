import type { ComponentProps } from 'react';

import { twMerge } from 'tailwind-merge';

interface CardProps extends ComponentProps<'div'> {}

export function Card(props: CardProps) {
  const { children, className, ...restOfProps } = props;

  return (
    <div
      className={twMerge('flex flex-col items-stretch shadow-md', className)}
      {...restOfProps}
    >
      {children}
    </div>
  );
}
