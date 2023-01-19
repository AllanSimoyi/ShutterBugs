import { Spinner, Text, VStack } from "@chakra-ui/react";

export function Posting () {
  return (
    <VStack justify="center" align="center" p={4} h="100%">
      <Spinner size="lg" />
      <Text fontSize="lg">
        Posting...
      </Text>
    </VStack>
  )
}