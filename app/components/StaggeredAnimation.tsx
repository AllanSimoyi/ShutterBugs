import type { StackProps} from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
// import { ScrollAnimateUp } from "./ScrollAnimateUp";

interface Props extends StackProps {
  delay?: number;
  children: React.ReactNode[];
}

export function StaggeredAnimation (props: Props) {
  // const { children, delay = 0, ...restOfProps } = props;
  const { children, ...restOfProps } = props;

  return (
    <VStack align="stretch" {...restOfProps}>
      {children.filter(child => child).map((element, index) => (
        <VStack align="stretch" key={index}>
          {element}
        </VStack>
        // <ScrollAnimateUp key={index} delay={delay + (index * .1)}>
        //   {element}
        // </ScrollAnimateUp>
      ))}
    </VStack>
  )
}