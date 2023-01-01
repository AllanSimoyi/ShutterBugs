import type { StackProps } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react"

interface Props extends StackProps {
  children: React.ReactNode
}

export function Chip (props: Props) {
  const { children, ...otherProps } = props
  return (
    <VStack
      p="2"
      align="stretch"
      borderRadius="md"
      bgColor="blackAlpha.100"
      {...otherProps}
      spacing={0}
    >
      {children}
    </VStack>
  )
}
