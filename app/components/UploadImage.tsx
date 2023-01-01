import { HStack, Text, VStack } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import { ImageUploadSizeLimit } from '~/lib/core.validations';
import type { UploadState } from '../lib/imageUploading';
import { useIsSubmitting } from './ActionContextProvider';
import { ImageUploadIcon } from './ImageUploadIcon';

interface Props {
  onChange: (files: File[]) => void;
  uploadState: UploadState;
  uploadError: string;
  publicId: string;
  identifier: string;
}

export function UploadImage (props: Props) {
  const { onChange, uploadState, uploadError, publicId, identifier } = props;

  const isProcessing = useIsSubmitting();

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onChange([event.target.files[0]!]);
    }
  }, [onChange]);

  return (
    <>
      <label htmlFor={`file${ identifier }`}>
        <VStack
          p="4"
          border='1px'
          borderStyle="dashed"
          justify="center"
          cursor={"pointer"}
          align="flex-start"
          borderRadius={"md"}
          borderColor='blackAlpha.400'
          _hover={{ background: "blackAlpha.100" }}>
          <HStack spacing="12px">
            <ImageUploadIcon
              status={uploadState}
              publicId={publicId}
              cursor={"pointer"}
              style={{ color: getIconColor(uploadState) }}
            />
            <div>
              <Text cursor={"pointer"} fontSize="md">Upload {identifier}</Text>
              <Text cursor={"pointer"} fontSize="xs">Image should not exceed {ImageUploadSizeLimit.DisplayValue}</Text>
              {uploadError && (<Text fontSize="md" color="red.600">{uploadError}</Text>)}
            </div>
          </HStack>
        </VStack>
      </label>
      <input disabled={isProcessing} onChange={handleChange} id={`file${ identifier }`} accept="image/*" type="file" style={{ position: "absolute", visibility: "hidden", opacity: 0, top: 0, left: 0, }} />
    </>
  );
}

function getIconColor (status: UploadState) {
  const mapping: [string, string][] = [
    ["uploaded", "red"],
    ["uploading", "blue"],
    ["error", "red"],
  ];
  const match = mapping.find(el => el[0] === status);
  return match?.[1] || "grey";
}
