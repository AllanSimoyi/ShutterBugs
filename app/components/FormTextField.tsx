import type { ComponentProps } from 'react';

import { twMerge } from 'tailwind-merge';

import { useField, useIsSubmitting } from './ActionContextProvider';

type Props = ComponentProps<'input'> & {
  customRef?: ComponentProps<'input'>['ref'];
  name: string;
  label?: string | undefined;
};
export function FormTextField(props: Props) {
  const { customRef, name, label, className, ...restOfProps } = props;

  const { value, error } = useField(name);
  const isSubmitting = useIsSubmitting();

  return (
    <div className="flex flex-col items-stretch justify-center gap-1">
      {label && <span className="font-thin text-stone-400">{label}</span>}
      <input
        required
        ref={customRef}
        type="text"
        name={name}
        disabled={isSubmitting}
        defaultValue={typeof value === 'string' ? value : undefined}
        aria-invalid={!!error?.length}
        aria-describedby={`${name}-error`}
        className={twMerge(
          'transition-all duration-300',
          'rounded-md border border-stone-400 p-2 font-light outline-none focus:ring-1 focus:ring-stone-400',
          error?.length && 'border-2 border-red-600',
          className
        )}
        {...restOfProps}
      />
      {error?.length && (
        <div className="text-sm text-red-500" id={`${name}-error`}>
          {error.join(', ')}
        </div>
      )}
    </div>
  );
}
