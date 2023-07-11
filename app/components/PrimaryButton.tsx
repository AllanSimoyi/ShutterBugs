import type { RemixLinkProps } from '@remix-run/react/dist/components';
import type { ComponentProps } from 'react';

import { Link } from '@remix-run/react';

interface GetClassNameProps {
  large?: boolean;
  className: string | undefined;
  disabled: boolean | undefined;
}
function getClassName(props: GetClassNameProps) {
  const { large, disabled, className: inputClassName } = props;

  const className =
    'rounded font-semibold transition-all duration-300 text-center text-white ' +
    (large ? 'py-6 text-[1.2em] uppercase xl:p-8 ' : 'p-4 text-base ') +
    (disabled
      ? 'bg-green-600/50 cursor-not-allowed '
      : 'bg-green-600 hover:bg-green-700 focus:bg-green-600 focus:outline-green-600 ') +
    (inputClassName || '');
  return className;
}

interface Props extends ComponentProps<'button'> {
  large?: boolean;
}
export function PrimaryButton(props: Props) {
  const { large, type = 'button', disabled, className, ...restOfProps } = props;

  return (
    <button
      type={type}
      className={getClassName({ large, className, disabled })}
      disabled={disabled}
      {...restOfProps}
    />
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link>, RemixLinkProps {
  large?: boolean;
}
export function PrimaryButtonLink(props: ButtonLinkProps) {
  const { className, large, children, ...restOfProps } = props;

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
export function PrimaryButtonExternalLink(props: ExternalLinkProps) {
  const { large, className, children, ...restOfProps } = props;

  return (
    <a
      className={getClassName({ large, className, disabled: false })}
      children={children}
      {...restOfProps}
    />
  );
}
