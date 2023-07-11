import type { RemixLinkProps } from '@remix-run/react/dist/components';
import type { ComponentProps } from 'react';

import { Link } from '@remix-run/react';

interface GetClassNameProps {
  className: string | undefined;
  disabled: boolean | undefined;
  large?: boolean;
}
function getClassName(props: GetClassNameProps) {
  const { className: inputClassName, disabled, large } = props;
  const className =
    'bg-stone-100 rounded font-semibold transition-all duration-300 text-center ' +
    (disabled
      ? 'text-stone-400 cursor-not-allowed '
      : 'text-green-600 hover:bg-stone-200 focus:bg-stone-200 focus:outline-green-100 ') +
    (large ? 'py-6 text-[1.2em] uppercase xl:p-8 ' : 'p-4 text-base ') +
    (inputClassName || '');
  return className;
}

interface Props extends ComponentProps<'button'> {
  large?: boolean;
}
export function SecondaryButton(props: Props) {
  const {
    large,
    className,
    children,
    type = 'button',
    disabled,
    ...restOfProps
  } = props;
  return (
    <button
      type={type}
      className={getClassName({ large, className, disabled })}
      children={children}
      disabled={disabled}
      {...restOfProps}
    />
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link>, RemixLinkProps {
  large?: boolean;
}
export function SecondaryButtonLink(props: ButtonLinkProps) {
  const { children, large, className, ...restOfProps } = props;
  return (
    <Link
      className={getClassName({ large, className, disabled: false })}
      children={children}
      {...restOfProps}
    />
  );
}

interface ExternalLinkProps extends ComponentProps<'a'> {
  large?: boolean;
}
export function SecondaryButtonExternalLink(props: ExternalLinkProps) {
  const { children, className, large, ...restOfProps } = props;
  return (
    <a
      className={getClassName({ large, className, disabled: false })}
      children={children}
      {...restOfProps}
    />
  );
}
