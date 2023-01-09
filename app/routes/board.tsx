import { Link as ChakraLink, Text, VStack } from '@chakra-ui/react';
import type { MetaFunction } from "@remix-run/node";
import { Link } from '@remix-run/react';
import { BoundaryError, PrimaryButton } from "remix-chakra-reusables";
import { AppLinks } from '~/lib/links';

export const meta: MetaFunction = () => {
  return {
    title: "Board",
  };
};

export default function BoardPage () {

  return (
    <VStack align="stretch" spacing={4}>
      <VStack align="center" py={8}>
        <BoundaryError title="Error 400 - Bad Request">
          <Text fontSize="sm" textAlign={"center"}>
            "Please provide a valid product ID"
          </Text>
          <Text fontSize="sm" textAlign={"center"}>
            We received a malformed or invalid request. <br />
            Please review your input and ensure it is valid. <br />
            If the issue pesists,&nbsp;
            <ChakraLink color="blue.600" fontWeight={"semibold"} as={Link} to={AppLinks.CustomerCare}>
              contact Customer Care
            </ChakraLink>
          </Text>
          <PrimaryButton onClick={() => {}}>
            Reload
          </PrimaryButton>
        </BoundaryError>
      </VStack>
    </VStack>
  );
}
