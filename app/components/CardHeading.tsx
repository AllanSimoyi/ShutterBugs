import type { StackProps } from "@chakra-ui/react";
import { Heading, VStack } from "@chakra-ui/react"

interface Props extends StackProps {
  children: React.ReactNode,
  noBottomBorder?: boolean
}

export function CardHeading (props: Props) {
  const { children, noBottomBorder = false, ...restOfProps } = props
  return (
    <VStack
      justify="center"
      align="center"
      borderBottom={noBottomBorder ? "none" : "1px"}
      borderColor={noBottomBorder ? "none" : "gray.300"}
      borderStyle={noBottomBorder ? "none" : "solid"}
      p={6}
      {...restOfProps}
    >
      <Heading fontSize="xl" fontWeight="thin">
        {children}
      </Heading>
    </VStack>
  )
}
