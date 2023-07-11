import { useCallback, useState } from 'react';

import { useCloudinary } from '~/components/CloudinaryContextProvider';
import { UploadState, uploadToCloudinary } from '~/lib/cloudinary';
import { getErrorMessage } from '~/lib/errors';

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
  const { imageIds, ImageUploadSizeLimit: SizeLimit } = props;

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

        const tooLarge = files.some((file) => file.size > SizeLimit.Value);
        if (tooLarge) {
          throw new Error(
            `Please upload images less than ${SizeLimit.Caption}`
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
          files.map((file) =>
            uploadToCloudinary(
              file,
              CLOUDINARY_CLOUD_NAME,
              CLOUDINARY_UPLOAD_RESET
            )
          )
        );

        setImageUploads((prevState) => {
          return [
            ...prevState.filter((imageUpload) => imageUpload.imageId),
            ...results.map((result) => {
              if (!result.success) {
                return {
                  imageId: '',
                  uploadState: UploadState.Error,
                  uploadError: result.err.message,
                };
              }
              return {
                imageId: result.data.publicId,
                uploadState: UploadState.Uploaded,
                uploadError: '',
              };
            }),
          ];
        });
      } catch (error) {
        setError(
          getErrorMessage(error) ||
            'Something went wrong uploading image, please try again'
        );
      }
    },
    [CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_RESET, SizeLimit]
  );

  return { imageUploads, setImageUploads, uploadImages, error };
}
