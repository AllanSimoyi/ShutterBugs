import type { RemixLinkProps } from '@remix-run/react/dist/components';
import type { ComponentProps } from 'react';

import { Link } from '@remix-run/react';
import { twMerge } from 'tailwind-merge';

interface GetClassNameProps {
  className: string | undefined;
  disabled: boolean | undefined;
}
function getClassName(props: GetClassNameProps) {
  const { disabled, className: inputClassName } = props;

  const className = twMerge(
    'rounded-md transition-all duration-300 text-center text-white p-3',
    'bg-stone-600 hover:bg-stone-700 focus:bg-stone-600 focus:outline-stone-600',
    disabled && 'bg-stone-600/50 cursor-not-allowed hover:bg-stone-600/50',
    inputClassName
  );
  return className;
}

interface Props extends ComponentProps<'button'> {}
export function PrimaryButton(props: Props) {
  const { type = 'button', disabled, className, ...restOfProps } = props;

  return (
    <button
      type={type}
      className={getClassName({ className, disabled })}
      disabled={disabled}
      {...restOfProps}
    />
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link>, RemixLinkProps {}
export function PrimaryButtonLink(props: ButtonLinkProps) {
  const { className, children, ...restOfProps } = props;

  return (
    <Link
      className={getClassName({ className, disabled: false })}
      children={children}
      {...restOfProps}
    />
  );
}

interface ExternalLinkProps extends ComponentProps<'a'> {}
export function PrimaryButtonExternalLink(props: ExternalLinkProps) {
  const { className, children, ...restOfProps } = props;

  return (
    <a
      className={getClassName({ className, disabled: false })}
      children={children}
      {...restOfProps}
    />
  );
}
