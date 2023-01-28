import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { Form, Link } from '@remix-run/react';
import { ChevronDown } from 'tabler-icons-react';

import { AppLinks } from '~/lib/links';

interface Props {
  loggedIn: boolean;
}

export function DropDownMenu(props: Props) {
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
            <MenuItem as={Link} to={AppLinks.Profile} fontSize={'sm'} py={4}>
              Profile
            </MenuItem>
            <MenuItem as={Link} to={AppLinks.NewPost} fontSize={'sm'} py={4}>
              Create
            </MenuItem>
            <Form action="/logout" method="post">
              <MenuItem type="submit" fontSize="sm" py={4}>
                Log Out
              </MenuItem>
            </Form>
          </>
        )}
        {!loggedIn && (
          <>
            <MenuItem as={Link} to={AppLinks.Login} fontSize={'sm'} py={2}>
              Log In
            </MenuItem>
            <MenuItem as={Link} to={AppLinks.Join} fontSize={'sm'} py={2}>
              Create Account
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
