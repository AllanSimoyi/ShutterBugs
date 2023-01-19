import { Text, VStack } from "@chakra-ui/react";
import { Check } from "tabler-icons-react";

export function Done () {
  return (
    <VStack justify="center" align="center" p={4} h="100%">
      <Check
        size={40}
        color={"green"}
      />
      <Text fontSize="lg">
        Upload Done
      </Text>
    </VStack>
  )
}