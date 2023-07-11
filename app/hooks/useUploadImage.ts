import { useCallback, useState } from 'react';

import { useCloudinary } from '~/components/CloudinaryContextProvider';
import { UploadState, uploadToCloudinary } from '~/lib/cloudinary';
import { getErrorMessage } from '~/lib/errors';

interface Props {
  imageId: string;
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

export function useUploadImage(props: Props) {
  const { imageId: initImageId, ImageUploadSizeLimit: SizeLimit } = props;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_RESET } = useCloudinary();

  const [imageId, setImageId] = useState(initImageId || '');
  const [uploadState, setUploadState] = useState(UploadState.Idle);
  const [error, setError] = useState('');

  const removeImage = useCallback(() => {
    setImageId('');
  }, []);

  const uploadImage = useCallback(
    async (file: File) => {
      try {
        setError('');

        if (file.size > SizeLimit.Value) {
          throw new Error(
            `Please upload images less than ${SizeLimit.Caption}`
          );
        }

        setImageId('');
        setError('');
        setUploadState(UploadState.Uploading);

        const result = await uploadToCloudinary(
          file,
          CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_UPLOAD_RESET
        );

        if (!result.success) {
          throw new Error(result.err.message);
        }
        setImageId(result.data.publicId);
        setUploadState(UploadState.Uploaded);
        setError('');
      } catch (error) {
        setUploadState(UploadState.Error);
        setError(getErrorMessage(error) || 'Upload failed, please try again');
      }
    },
    [CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_RESET, SizeLimit]
  );

  return { imageId, uploadState, uploadError: error, uploadImage, removeImage };
}
