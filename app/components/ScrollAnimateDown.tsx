import type { StackProps} from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { getSlideDownScrollVariants } from "../lib/scroll-variants";
import { ScrollAnimation } from "./ScrollAnimation";

interface Props extends StackProps {
  delay: number;
  children: React.ReactNode;
}

export function ScrollAnimateDown (props: Props) {
  const { delay, children, ...restOfProps } = props;
  return (
    <ScrollAnimation variants={getSlideDownScrollVariants({ delay })}>
      <VStack align="stretch" {...restOfProps}>
        {children}
      </VStack>
    </ScrollAnimation>
  )
}