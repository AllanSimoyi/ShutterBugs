import { Hide, HStack, Input, Show, Spacer, Stack, Text, useColorMode, VStack } from '@chakra-ui/react';
import { AppTitle, CenteredView, ToggleColorMode, ToolbarNavItem } from 'remix-chakra-reusables';
import { Search } from 'tabler-icons-react';
import { PRODUCT_NAME } from '~/lib/constants';

export interface ToolbarProps {
  currentUserName: string | undefined;
}

export function Toolbar (props: ToolbarProps) {
  const { currentUserName } = props;
  const { colorMode } = useColorMode();

  return (
    <VStack
      w="100%"
      as="header"
      zIndex={99}
      boxShadow="sm"
      align={"stretch"}
      position="relative"
      backdropFilter="saturate(240%) blur(10px)"
      backgroundColor={colorMode === "light" ? "whiteAlpha.800" : "whiteAlpha.200"}
      style={{ position: 'sticky' }}
      sx={{ position: '-webkit-sticky', top: '0' }}
    >
      <CenteredView>
        <Stack
          py={4}
          px={4}
          spacing={{ base: 2, lg: 6 }}
          align={{ base: "stretch", lg: "center" }}
          direction={{ base: "column", lg: "row" }}
        >
          <HStack align="center">
            <AppTitle title={PRODUCT_NAME} />
            <Hide above="lg">
              <Spacer />
              <ToggleColorMode variant="ghost" aria-label="Toggle Dark Mode" />
            </Hide>
          </HStack>
          <Spacer />
          <HStack
            justify="center"
            align="center"
            borderRadius={30}
            bgColor={colorMode === "light" ? "blackAlpha.200" : "whiteAlpha.200"}
            flexGrow={1}
            spacing={4}
            py={2}
            px={6}
          >
            <Search />
            <Input
              type="text"
              name="searchTerms"
              variant='unstyled'
              placeholder='Search'
              borderRadius={30}
              fontSize="sm"
              px={1}
              w="100%"
            />
          </HStack>
          <Spacer />
          <Show above="lg">
            {!currentUserName && (
              <ToolbarNavItem
                navItem={{
                  text: "Create Account",
                  href: "/join",
                  primary: true,
                }}
              />
            )}
            {currentUserName && (
              <Text fontSize="sm" title={currentUserName}>
                {currentUserName}
              </Text>
            )}
            <ToggleColorMode variant="ghost" aria-label="Toggle Dark Mode" />
          </Show>
        </Stack>
      </CenteredView>
    </VStack>
  )
}