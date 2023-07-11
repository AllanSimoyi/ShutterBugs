import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { DotsVertical } from 'tabler-icons-react';

interface Props {}

export function PostDropDownMenu(_: Props) {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        size="sm"
        aria-label="Post Options"
        icon={<DotsVertical data-testid="menu" />}
        variant="ghost"
      />
      <MenuList>
        <MenuItem fontSize={'sm'} py={2}>
          Post Item 1
        </MenuItem>
        <MenuItem fontSize={'sm'} py={2}>
          Post Item 2
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
