import type { StackProps } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react"

interface Props extends StackProps {
  children: React.ReactNode
  noBottomBorder?: boolean
}

export function CardSection (props: Props) {
  const { children, noBottomBorder = false, ...rest } = props
  return (
    <VStack
      p={rest.p || 6}
      justify="center"
      align="stretch"
      borderBottom={noBottomBorder ? undefined : "1px"}
      borderColor={noBottomBorder ? undefined : "gray.200"}
      borderStyle={noBottomBorder ? undefined : "solid"}
      {...rest}
    >
      {children}
    </VStack>
  )
}
