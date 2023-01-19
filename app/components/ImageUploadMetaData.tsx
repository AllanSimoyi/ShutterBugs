import { VStack } from "@chakra-ui/react";
import { TextField } from "remix-chakra-reusables";

export function ImageUploadMetaData () {
  return (
    <VStack align="stretch" spacing={4} p={4}>
      <TextField
        type="text"
        label="Caption"
        placeholder="Enter a brief description of the post (Optional)"
        name="description"
      />
    </VStack>
  )
}