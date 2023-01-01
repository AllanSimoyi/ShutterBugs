import { Img, Text, VStack } from "@chakra-ui/react";
import empty from "~/../public/images/empty.ico";

interface Props {
  children: string;
  imageHeight?: number | string;
}

export function RecordsNotFound (props: Props) {
  const { children, imageHeight } = props;
  return (
    <VStack justify="center" align="center" py={8} spacing={6}>
      <Img
        src={empty}
        h={imageHeight || 40}
        objectFit="contain"
        alt="No records found"
      />
      <Text fontSize="md" fontWeight="light" color="blackAlpha.600">
        {children}
      </Text>
    </VStack>
  )
}