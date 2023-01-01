import { Button, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Show, VStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { ChevronDown, DotsVertical } from "tabler-icons-react";
import type { CurrentUser } from "~/lib/auth.validations";
import { AccessLevel, UserType } from "~/lib/auth.validations";
import type { CustomMenuItem } from "~/lib/menuItems";
import { authMenuItems } from "~/lib/menuItems";
import { adminAgencyListings, adminBankListings, agentAgencyListings, employeeBankListings, ownerListings, systemAdminListings } from "~/lib/menuItems";
import { Logout } from "./Logout";

export interface MenuPropertyType {
  id: string;
  identifier: string
}

interface Props {
  currentUser: CurrentUser | undefined;
  propertyTypes: MenuPropertyType[];
}

interface ConditionalItems {
  conditions: boolean[];
  items: CustomMenuItem[];
}

export function DropDownMenu (props: Props) {
  const { currentUser } = props;
  const { userType, accessLevel } = currentUser || {};

  const conditionalItemsSet: ConditionalItems[] = [
    {
      conditions: [userType === UserType.Admin],
      items: systemAdminListings,
    },

    {
      conditions: [userType === UserType.Buyer],
      items: [{
        customKey: "Home",
        href: "/",
        caption: "Home",
      }],
      // items: propertyTypes.map(propertyType => ({
      //   customKey: propertyType.id,
      //   href: `/?propertyTypeId=${propertyType.id}`,
      //   caption: propertyType.identifier,
      // }))
    },

    {
      conditions: [userType === UserType.PropertyOwner],
      items: ownerListings,
    },

    {
      conditions: [
        userType === UserType.Agency,
        accessLevel === AccessLevel.Admin
      ],
      items: adminAgencyListings,
    },
    {
      conditions: [
        userType === UserType.Agency,
        accessLevel === AccessLevel.Regular
      ],
      items: agentAgencyListings,
    },

    {
      conditions: [
        userType === UserType.Bank,
        accessLevel === AccessLevel.Admin
      ],
      items: adminBankListings,
    },
    {
      conditions: [
        userType === UserType.Bank,
        accessLevel === AccessLevel.Regular
      ],
      items: employeeBankListings,
    },
  ]

  return (
    <Menu>
      <Show below="lg">
        <MenuButton
          as={Button}
          size="sm"
          rightIcon={<ChevronDown />}>
          Menu
        </MenuButton>
      </Show>
      <Show above="lg">
        <MenuButton
          as={IconButton}
          size="sm"
          aria-label="Options"
          icon={<DotsVertical data-testid="menu" />}
          variant="ghost"
        />
      </Show>
      <MenuList>
        {currentUser && (
          <>
            <Link to="/my-profile">
              <MenuItem py={2} fontSize={"sm"}>My Profile</MenuItem>
            </Link>
            <MenuDivider />
          </>
        )}
        {conditionalItemsSet.map((conditionals, index) => {
          const { conditions, items } = conditionals;
          return (
            <VStack key={index} align="stretch" py={0} spacing={0}>
              {conditions.every(condition => condition) && (
                <>
                  {items.map(item => (
                    <Link key={item.customKey || item.caption} to={item.href}>
                      <MenuItem py={2} fontSize={"sm"}>{item.caption}</MenuItem>
                    </Link>
                  ))}
                </>
              )}
            </VStack>
          )
        })}
        {!currentUser && (
          <>
            {authMenuItems.map(item => (
              <Link key={item.customKey || item.caption} to={item.href}>
                <MenuItem py={2} fontSize={"sm"}>{item.caption}</MenuItem>
              </Link>
            ))}
          </>
        )}
        {currentUser && (
          <>
            <MenuDivider />
            <Logout />
          </>
        )}
      </MenuList>
    </Menu>
  )
}