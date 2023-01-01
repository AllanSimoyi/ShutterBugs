import { Text, VStack } from "@chakra-ui/react";

interface Props {
  errors: string[];
}

export function SeveralErrors (props: Props) {
  const { errors } = props;
  
  return (
    <VStack align="stretch">
      {errors.map((error, index) => (
        <Text key={index} fontSize="sm">
          {index + 1}. {error}
        </Text>
      ))}
    </VStack>
  )
}