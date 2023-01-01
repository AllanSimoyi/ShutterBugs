import {
  Alert, AlertDescription, AlertIcon,
  AlertTitle,
  VStack
} from '@chakra-ui/react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export function BoundaryError (props: Props) {
  const { title, children } = props;
  return (
    <Alert
      flexDirection='column'
      alignItems='stretch'
      justifyContent='center'
      status='error'
      variant='subtle'
      textAlign='center'
      minHeight='200px'
      maxWidth={'600px'}
      borderRadius={5}
      p={6}
    >
      <VStack align="center">
        <AlertIcon
          boxSize='40px'
          mr={0}
        />
      </VStack>
      <VStack align="center" py={6}>
        <AlertTitle fontSize='lg'>
          {title}
        </AlertTitle>
      </VStack>
      <AlertDescription>
        <VStack align="stretch" spacing={6}>
          {children}
        </VStack>
      </AlertDescription>
    </Alert>
  )
}