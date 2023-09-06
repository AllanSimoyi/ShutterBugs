import type { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {}

export function UnderLineOnHover(props: Props) {
  const { children, ...restOfProps } = props;
  return (
    <div className="group flex flex-col items-stretch gap-0" {...restOfProps}>
      {children}
      <span className="block h-0.5 max-w-0 bg-stone-600 transition-all duration-300 group-hover:max-w-full" />
    </div>
  );
}
