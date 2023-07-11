import type { ComponentProps } from 'react';

import { useColorMode } from '@chakra-ui/react';
import { Moon, Sun } from 'tabler-icons-react';

import { GhostButton } from './GhostButton';

interface Props extends ComponentProps<typeof GhostButton> {}

export function ToggleColorMode(props: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <GhostButton type="button" onClick={toggleColorMode} {...props}>
      {colorMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </GhostButton>
  );
}
