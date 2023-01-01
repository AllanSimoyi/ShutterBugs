import type { HeadingProps } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";

interface Props extends HeadingProps {
  children: React.ReactNode;
}

export function StandardHeading ({ children, ...restOfProps }: Props) {
  return (
    <Heading fontSize="xl" fontWeight="thin" {...restOfProps}>
      {children}
    </Heading>
  )
}