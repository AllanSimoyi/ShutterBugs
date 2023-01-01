import type { StackProps } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react"

interface Props extends StackProps {
  children: React.ReactNode
}

export function Card (props: Props) {
  const { children, bg, ...restOfProps } = props
  return (
    <VStack
      bg={bg || "white"}
      spacing={0}
      align="stretch"
      borderWidth="1px"
      borderColor="gray.400"
      borderRadius="md"
      overflow="hidden"
      shadow="xl"
      {...restOfProps}
    >
      {children}
    </VStack>
  )
}
