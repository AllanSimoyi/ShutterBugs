import type { ChangeEvent } from 'react';

import { Button, VStack } from '@chakra-ui/react';

import { FILE_INPUT_STYLE } from '~/lib/constants';

interface Props {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function AddImage(props: Props) {
  const { handleChange } = props;

  return (
    <VStack align="stretch">
      <input
        multiple
        id="file"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={FILE_INPUT_STYLE}
      />
      <label htmlFor="file" style={{ cursor: 'pointer', display: 'block' }}>
        <Button
          type="submit"
          w="100%"
          fontSize="lg"
          variant="solid"
          style={{ pointerEvents: 'none' }}
        >
          Add Image
        </Button>
      </label>
    </VStack>
  );
}
