import type { ThemeConfig } from '@chakra-ui/react';

import {
  baseTheme,
  extendTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';

export const themeColors = {
  primary: baseTheme.colors.gray,
  accent: baseTheme.colors.purple,
};

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const theme = extendTheme(
  {
    config,
    fonts: {
      heading: `'Montserrat', sans-serif`,
      body: `'Montserrat', sans-serif`,
    },
    colors: {
      primary: themeColors.primary,
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' })
);

export default theme;
