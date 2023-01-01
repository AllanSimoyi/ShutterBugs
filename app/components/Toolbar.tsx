import { HStack, Show, Spacer, Stack, Text, VStack } from '@chakra-ui/react';
import type { CurrentUser } from "~/lib/auth.validations";
import type { LeanLocation } from '~/lib/location.validations';
import { AppTitle } from "./AppTitle";
import { CenteredView } from "./CenteredView";
import { CustomNavItem } from "./CustomNavItem";
import type { MenuPropertyType } from "./DropDownMenu";
import { DropDownMenu } from "./DropDownMenu";
import { FilterProperties } from './properties/FilterProperties';
import type { PopoverDisclosure } from './properties/PopoverFilterProperties';
import { PopoverFilterProperties } from './properties/PopoverFilterProperties';

export interface ToolbarProps {
  showFilterControls: boolean;
  currentUser: CurrentUser | undefined;
  propertyTypes: MenuPropertyType[]
  locations: LeanLocation[];
  notSticky?: boolean;
  popoverDisclosure?: PopoverDisclosure;
}

export function Toolbar (props: ToolbarProps) {
  const { showFilterControls, currentUser, propertyTypes, locations } = props;
  const { popoverDisclosure, notSticky = false } = props;
  return (
    <VStack
      w="100%"
      as="header"
      zIndex={99}
      boxShadow="sm"
      borderWidth="1px"
      bgColor={"white"}
      align={"stretch"}
      borderColor="gray.200"
      // position="fixed"
      position={notSticky ? undefined : "relative"}
      backdropFilter="saturate(180%) blur(5px)"
      backgroundColor="rgba(255, 255, 255, 0.8)"
      style={notSticky ? undefined : { position: 'sticky' }}
      sx={notSticky ? undefined : { position: '-webkit-sticky', top: '0' }}
    >
      <CenteredView>
        <Stack
          py={4}
          spacing={{ base: 2, lg: 6 }}
          align={{ base: "stretch", lg: "center" }}
          direction={{ base: "column", lg: "row" }}
        >
          <Show below="lg">
            <HStack align="flex-end">
              <AppTitle />
              <Spacer />
              <VStack align="flex-end" px={4}>
                <DropDownMenu currentUser={currentUser} propertyTypes={propertyTypes} />
              </VStack>
            </HStack>
          </Show>
          <Show above="lg">
            <AppTitle />
          </Show>
          <Spacer />
          {showFilterControls && (
            <>
              <Show below="lg">
                <VStack align="flex-end" px={4}>
                  <PopoverFilterProperties
                    propertyTypes={propertyTypes}
                    locations={locations}
                    isProcessing={false}
                    disclosure={popoverDisclosure!}
                  />
                </VStack>
              </Show>
              <Show above="lg">
                <FilterProperties
                  px={4}
                  locations={locations}
                  propertyTypes={propertyTypes}
                  isProcessing={false}
                />
              </Show>
              <Spacer />
            </>
          )}
          {!currentUser && (
            <Show above="lg">
              <CustomNavItem
                item={{
                  text: "Create Account",
                  href: "/join",
                  primary: true,
                }}
              />
            </Show>
          )}
          <Show above="lg">
            {currentUser && (
              <Text fontSize="sm" color="blackAlpha.800" title={currentUser.email}>
                {currentUser.fullName}
              </Text>
            )}
            <DropDownMenu currentUser={currentUser} propertyTypes={propertyTypes} />
          </Show>
        </Stack>
      </CenteredView>
    </VStack>
  )
}