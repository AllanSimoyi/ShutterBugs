import type {
  StackProps} from '@chakra-ui/react';
import {
  Alert,
  AlertIcon,
  VStack
} from '@chakra-ui/react';

interface Props  extends StackProps {
  status: "error" | "info" | "warning";
  children: React.ReactNode;
}

export function CustomAlert (props: Props) {
  const { children, status, ...restOfProps } = props;
  return (
    <VStack align="stretch" {...restOfProps}>
      <Alert borderRadius={6} status={status} fontSize="sm">
        <AlertIcon />
        {children}
      </Alert>
    </VStack>
  )
}