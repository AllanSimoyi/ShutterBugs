import { IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { ChevronDown } from "tabler-icons-react";
import { AppLinks } from "~/lib/links";

interface Props {
  loggedIn: boolean;
}

export function DropDownMenu (props: Props) {
  const { loggedIn } = props;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        size="sm"
        aria-label="Options"
        icon={<ChevronDown data-testid="menu" />}
        // icon={<DotsVertical data-testid="menu" />}
        variant="ghost"
      />
      <MenuList>
        {loggedIn && (
          <>
            <MenuItem as={Link} to={AppLinks.Home} fontSize={"sm"} py={2}>
              Settings
            </MenuItem>
            <MenuDivider />
            <MenuItem as={Link} to={AppLinks.Home} fontSize={"sm"} py={2}>
              Create
            </MenuItem>
            <MenuDivider />
            <Form action="/logout" method="post">
              <MenuItem type="submit" fontSize="sm" py={2}>
                Log Out
              </MenuItem>
            </Form>
          </>
        )}
        {!loggedIn && (
          <>
            <MenuItem as={Link} to={AppLinks.Login} fontSize={"sm"} py={2}>
              Log In
            </MenuItem>
            <MenuItem as={Link} to={AppLinks.Join} fontSize={"sm"} py={2}>
              Create Account
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  )
}