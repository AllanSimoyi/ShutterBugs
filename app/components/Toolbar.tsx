import {
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import {
  AppTitle,
  CenteredView,
  ToggleColorMode,
} from 'remix-chakra-reusables';
import { Search } from 'tabler-icons-react';

import { PRODUCT_NAME } from '~/lib/constants';
import { AppLinks } from '~/lib/links';

import { DropDownMenu } from './DropDownMenu';

export interface ToolbarProps {
  currentUserName: string | undefined;
  hideSearchOnMobile?: boolean;
}

export function Toolbar(props: ToolbarProps) {
  const { hideSearchOnMobile, currentUserName } = props;
  const { colorMode } = useColorMode();

  return (
    <VStack
      w="100%"
      as="header"
      zIndex={99}
      boxShadow="sm"
      align={'stretch'}
      position="relative"
      backdropFilter="saturate(240%) blur(10px)"
      backgroundColor={
        colorMode === 'light' ? 'whiteAlpha.800' : 'blackAlpha.200'
      }
      style={{ position: 'sticky' }}
      sx={{ position: '-webkit-sticky', top: '0' }}
    >
      <CenteredView>
        <Stack
          py={4}
          px={4}
          spacing={{ base: 2, lg: 6 }}
          align={{ base: 'stretch', md: 'center', lg: 'center' }}
          direction={{ base: 'column', lg: 'row' }}
        >
          <HStack align="center" w={{ md: '60%', lg: '20%' }}>
            <Link to={AppLinks.Home}>
              <AppTitle title={PRODUCT_NAME} />
            </Link>
            <Spacer />
            <HStack justify="flex-end" display={{ lg: 'none' }} spacing={4}>
              <ToggleColorMode variant="ghost" aria-label="Toggle Dark Mode" />
              <DropDownMenu loggedIn={!!currentUserName} />
            </HStack>
          </HStack>
          <Spacer
            display={{ base: hideSearchOnMobile ? 'none' : 'flex', lg: 'flex' }}
          />
          <HStack
            justify="center"
            align="center"
            borderRadius={30}
            display={{ base: hideSearchOnMobile ? 'none' : 'flex', lg: 'flex' }}
            bgColor={
              colorMode === 'light' ? 'blackAlpha.200' : 'whiteAlpha.200'
            }
            flexGrow={1}
            spacing={4}
            minW={{ base: undefined, md: '60%', lg: '40%' }}
            py={2}
            px={6}
          >
            <Search />
            <Input
              type="text"
              name="searchTerms"
              variant="unstyled"
              placeholder="Search"
              borderRadius={30}
              fontSize="sm"
              flexGrow={1}
              px={1}
            />
          </HStack>
          <Spacer display={{ base: 'none', lg: 'flex' }} />
          <HStack
            display={{ base: 'none', lg: 'flex' }}
            justify="flex-end"
            align="center"
            w={{ lg: '20%' }}
            spacing={4}
          >
            {currentUserName && (
              <Text fontSize="sm" title={currentUserName} p={2}>
                {currentUserName}
              </Text>
            )}
            <ToggleColorMode variant="ghost" aria-label="Toggle Dark Mode" />
            <DropDownMenu loggedIn={!!currentUserName} />
          </HStack>
        </Stack>
      </CenteredView>
    </VStack>
  );
}
