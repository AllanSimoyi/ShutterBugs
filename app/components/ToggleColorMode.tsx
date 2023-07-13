import type { ComponentProps } from 'react';

import { Moon } from 'tabler-icons-react';

import { GhostButton } from './GhostButton';

interface Props extends ComponentProps<typeof GhostButton> {}

export function ToggleColorMode(props: Props) {
  return (
    <GhostButton type="button" {...props}>
      <Moon size={20} />
    </GhostButton>
  );
}
