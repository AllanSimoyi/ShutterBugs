import { Spacer, VStack } from "@chakra-ui/react";
import type { ToolbarProps } from "./Toolbar";
import { Toolbar } from "./Toolbar";

import { CenteredView } from "~/components/CenteredView";
import { Footer } from "~/components/Footer";

interface Props extends ToolbarProps {
  children: React.ReactNode;
}

export function ToolbarLayout (props: Props) {
  const { children, ...restOfProps } = props;

  return (
    <VStack align="stretch" spacing={0} minH="100vh" flexGrow={1}>
      <Toolbar {...restOfProps} />
      <VStack align="stretch" py={8} as="main">
        <CenteredView flexGrow={1} p={4}>
          {children}
        </CenteredView>
      </VStack>
      <Spacer />
      <Footer />
    </VStack>
  )
}