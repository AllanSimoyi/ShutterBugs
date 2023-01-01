import { HStack, VStack } from "@chakra-ui/react";
import type { StackProps, } from "@chakra-ui/react";

interface Props extends StackProps {
  children: React.ReactNode;
  innerProps?: StackProps;
}

export function CenteredView (props: Props) {
  const { children, innerProps, ...restOfProps } = props
  return (
    <>
      <HStack justify="center" align="stretch" {...restOfProps}>
        <VStack align="stretch" w={{ base: "100%", md: "100%", lg: "90%" }} {...innerProps}>
          {children}
        </VStack>
      </HStack>
    </>
  )
}