import type { ComponentProps } from 'react';

import { twMerge } from 'tailwind-merge';

interface Props extends ComponentProps<'div'> {
  children: React.ReactNode;
  innerProps?: ComponentProps<'div'>;
  className?: string;
}

export function CenteredView(props: Props) {
  const { children, innerProps, className, ...restOfProps } = props;
  return (
    <div className="flex flex-col items-center justify-center" {...restOfProps}>
      <div
        className={twMerge(
          'flex flex-col items-stretch',
          'w-full md:w-[80%] lg:w-[90%]',
          className
        )}
        {...innerProps}
      >
        {children}
      </div>
    </div>
  );
}
