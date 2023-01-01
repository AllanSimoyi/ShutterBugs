import type { StackProps } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { getSlideUpScrollVariants } from "../lib/scroll-variants";
import { ScrollAnimation } from "./ScrollAnimation";

interface Props extends StackProps {
  delay: number;
  children: React.ReactNode;
}

export function ScrollAnimateUp (props: Props) {
  const { delay, children, ...restOfProps } = props;
  return (
    <ScrollAnimation variants={getSlideUpScrollVariants({ delay })}>
      <VStack align="stretch" {...restOfProps}>
        {children}
      </VStack>
    </ScrollAnimation>
  )
}