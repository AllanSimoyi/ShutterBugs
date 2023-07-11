import { Spinner } from '@chakra-ui/react';

export function Posting() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <Spinner size="lg" />
      <span className="text-lg">Posting...</span>
    </div>
  );
}
