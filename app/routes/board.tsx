import { VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";

import { RootBoundaryError } from "~/components/RootBoundaryError";

export const meta: MetaFunction = () => {
  return {
    title: "Board",
  };
};

export default function LoginPage () {

  return (
    <VStack justify="center" align="center" p={8}>
      <RootBoundaryError error={new Error("Something went wrong")} />
    </VStack>
  );
}
