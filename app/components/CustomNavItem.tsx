import type { StackProps} from "@chakra-ui/react";
import { Button, VStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

export interface NavItem {
  text: string;
  href: string;
  primary?: boolean;
}

interface Props extends StackProps {
  item: NavItem;
  white?: boolean;
}

export function CustomNavItem (props: Props) {
  const { item, white, ...restOfProps } = props;
  return (
    <VStack {...restOfProps} key={item.text} p={0} align="stretch">
      <Link prefetch="intent" to={item.href}>
        <Button
          variant={item.primary ? "solid" : "ghost"}
          colorScheme={item.primary ? "red" : white ? "whiteAlpha" : undefined}
          fontWeight={item.primary || white ? "bold" : "thin"}
          fontSize="sm"
          borderRadius="25px">
          {item.text}
        </Button>
      </Link>
    </VStack>
  )
}