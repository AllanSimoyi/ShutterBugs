import { useCallback, useState } from 'react';
import {
  UploadState,
  uploadToCloudinary,
  useCloudinary,
} from 'remix-chakra-reusables';

interface Props {
  imageIds: string[];
  ImageUploadSizeLimit: {
    Value: number;
    Caption: string;
  };
}

export interface ImageUploadState {
  imageId: string;
  uploadState: UploadState;
  uploadError: string;
}

export function useUploadImages(props: Props) {
  const { imageIds, ImageUploadSizeLimit } = props;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_RESET } = useCloudinary();

  const [imageUploads, setImageUploads] = useState<ImageUploadState[]>(
    imageIds.map((imageId) => ({
      imageId,
      uploadState: UploadState.Uploaded,
      uploadError: '',
    }))
  );
  const [error, setError] = useState('');

  const uploadImages = useCallback(
    async (files: File[]) => {
      try {
        setError('');

        const tooLarge = files.some(
          (file) => file.size > ImageUploadSizeLimit.Value
        );
        if (tooLarge) {
          throw new Error(
            `Please ensure you upload images less than ${ImageUploadSizeLimit.Caption}`
          );
        }

        setImageUploads((prevState) => [
          ...prevState,
          ...files.map((_) => ({
            imageId: '',
            uploadState: UploadState.Uploading,
            uploadError: '',
          })),
        ]);

        const results = await Promise.all(
          files.map((file) => {
            return uploadToCloudinary(
              file,
              CLOUDINARY_CLOUD_NAME,
              CLOUDINARY_UPLOAD_RESET
            );
          })
        );

        setImageUploads((prevState) => {
          return [
            ...prevState.filter((imageUpload) => imageUpload.imageId),
            ...results.map((result) => {
              return result.success
                ? {
                    imageId: result.data.publicId,
                    uploadState: UploadState.Uploaded,
                    uploadError: '',
                  }
                : {
                    imageId: '',
                    uploadState: UploadState.Error,
                    uploadError: result.err.message,
                  };
            }),
          ];
        });
      } catch ({ message }) {
        setError(message as string);
      }
    },
    [CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_RESET, ImageUploadSizeLimit]
  );

  return { imageUploads, setImageUploads, uploadImages, error };
}
