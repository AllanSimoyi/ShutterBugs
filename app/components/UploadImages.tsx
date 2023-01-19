import { Divider, useToast, VStack } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useCallback, useEffect } from "react";
import { CustomAlert, RecordsNotFound, UploadState, useField } from "remix-chakra-reusables";
import type { ImageUploadState } from "~/hooks/useUploadImages";
import { AddImage } from "./AddImage";
import { ImageUpload } from "./ImageUpload";

interface Props {
  imageUploads: ImageUploadState[]
  setImageUploads: React.Dispatch<React.SetStateAction<ImageUploadState[]>>
  uploadImages: (files: File[]) => Promise<void>
  error: string
}

export function UploadImages (props: Props) {
  const { imageUploads, setImageUploads, uploadImages, error } = props;

  const toast = useToast();
  const { error: imageIdErrors } = useField("imageIds");

  console.log("imageIdErrors", imageIdErrors);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        status: "error",
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      uploadImages(Array.from(event.target.files));
    }
  }, [uploadImages]);

  const handleRemove = useCallback((imageId: string) => {
    setImageUploads(prevState => {
      return prevState.filter(el => el.imageId !== imageId);
    });
  }, [setImageUploads]);

  return (
    <VStack position="relative" align="stretch" flexGrow={1} spacing={0}>
      <VStack justify="center" align="stretch" flexGrow={1} p={4}>
        {imageIdErrors?.length && (
          <CustomAlert status={"error"}>
            {imageIdErrors.join(", ")}
          </CustomAlert>
        )}
        {!imageUploads.length && (
          <label htmlFor="file">
            <RecordsNotFound>
              No images selected yet
            </RecordsNotFound>
          </label>
        )}
        {imageUploads.length && (
          <VStack align="stretch" flexGrow={1} overflowY="auto">
            {imageUploads.map((imageUpload, index) => (
              <ImageUpload
                key={index}
                handleRemove={handleRemove}
                imageId={imageUpload.imageId}
                isUploading={imageUpload.uploadState === UploadState.Uploading}
              />
            ))}
          </VStack>
        )}
      </VStack>
      <Divider />
      <VStack align="stretch" p={4} bg="transparent">
        <AddImage handleChange={handleChange} />
      </VStack>
    </VStack>
  )
}