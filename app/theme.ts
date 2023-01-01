import { baseTheme, extendTheme, withDefaultColorScheme } from '@chakra-ui/react'

const theme = extendTheme(
  {
    fonts: {
      heading: `'Montserrat', sans-serif`,
      body: `'Montserrat', sans-serif`,
    },
    colors: {
      primary: baseTheme.colors.red,
    }
  },
  withDefaultColorScheme({ colorScheme: 'primary' })
)

export default theme