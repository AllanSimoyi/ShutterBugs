import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react"

interface Props extends ButtonProps {}

export function PrimaryButton(props: Props) {
  return (
    <Button colorScheme="red" fontSize="sm" {...props}>
      {props.children}
    </Button>
  )
}
