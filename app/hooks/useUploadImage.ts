import { useCallback, useState } from 'react';

import { UploadState } from '~/lib/cloudinary';
import { getErrorMessage } from '~/lib/errors';

import { useCloudinaryUpload } from './useCloudinaryUpload';

export function useUploadImage(initImageId: string) {
  const uploadToCloudinary = useCloudinaryUpload();

  const [imageId, setImageId] = useState(initImageId || '');
  const [uploadState, setUploadState] = useState(UploadState.Idle);
  const [error, setError] = useState('');

  const uploadImage = useCallback(
    async (file: File) => {
      try {
        setError('');
        setImageId('');
        setUploadState(UploadState.Uploading);

        if (file.size > 2_000_000) {
          throw new Error(`Provice an image less than 2MB in size`);
        }

        const result = await uploadToCloudinary(file);
        if (result instanceof Error) {
          throw result;
        }
        setImageId(result.publicId);
        setUploadState(UploadState.Uploaded);
        setError('');
        return result.publicId;
      } catch (error) {
        setUploadState(UploadState.Error);
        setError(getErrorMessage(error) || 'Upload failed, please try again');
      }
    },
    [uploadToCloudinary]
  );

  return { imageId, uploadState, error, uploadImage };
}
