import type { ComponentProps } from 'react';

import { InfoCircle } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';

import { capitalize } from '~/models/strings';

interface Props extends ComponentProps<'span'> {
  children: string;
}
export function Desc(props: Props) {
  const { children, className, ...restOfProps } = props;
  return (
    <span
      className={twMerge(
        'bg-black/40 p-2 text-start text-sm font-normal tracking-wider text-white/80',
        'flex flex-row items-start gap-2 rounded-lg',
        className
      )}
      title="This is an AI generated description of the images content"
      {...restOfProps}
    >
      <InfoCircle size={20} />
      <span>{capitalize(children)}</span>
    </span>
  );
}
