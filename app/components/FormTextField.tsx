import type { ComponentProps } from 'react';

import { twMerge } from 'tailwind-merge';

import { useField, useIsSubmitting } from './ActionContextProvider';

type Props<SchemaType extends Record<string, any>> = ComponentProps<'input'> & {
  customRef?: ComponentProps<'input'>['ref'];
  name: keyof SchemaType;
  label?: string | undefined;
};
export function FormTextField<SchemaType extends Record<string, any>>(
  props: Props<SchemaType>
) {
  const { customRef, name, label, className, ...restOfProps } = props;

  const { value, error } = useField<SchemaType>(name);
  const isSubmitting = useIsSubmitting();

  return (
    <div className="flex flex-col items-stretch justify-center space-y-2">
      {label && <span className="text-md text-white/50">{label}</span>}
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
          'rounded-md border border-white/5 bg-white/5 p-6 text-base font-semibold text-white outline-none backdrop-blur-xl focus:bg-white/10',
          error?.length ? 'outline-red-600' : undefined,
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
