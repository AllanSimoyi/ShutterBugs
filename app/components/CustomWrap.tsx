import type { WrapProps } from "@chakra-ui/react";
import { Wrap, WrapItem } from "@chakra-ui/react";

interface Props extends WrapProps {
  children: React.ReactNode[];
}

export function CustomWrap (props: Props) {
  const { children, ...restOfProps } = props;

  return (
    <Wrap {...restOfProps}>
      {children.map((element, index) => (
        <WrapItem key={index}>
          {element}
        </WrapItem>
      ))}
    </Wrap>
  )
}