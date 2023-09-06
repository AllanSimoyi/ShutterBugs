import { getErrorMessage } from './errors';

export enum UploadState {
  Uploading = 'uploading',
  Uploaded = 'uploaded',
  Error = 'error',
  Idle = 'idle',
}

export interface ImageUploadResult {
  publicId: string;
  url: string;
  height: number;
  width: number;
}

export async function uploadToCloudinary(
  file: File,
  CLOUD_NAME: string,
  UPLOAD_RESET: string
) {
  return new Promise(async (resolve) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_RESET);
    formData.append('tags', 'rte');
    formData.append('context', '');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

    try {
      const result = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      }).then((response) => response.json());

      if (!result) {
        throw new Error('Failed to upload image, please try again');
      }
      const { public_id: publicId, url, width, height } = result;

      return resolve({ publicId, url, width, height } as const);
    } catch (error) {
      return resolve(new Error(getErrorMessage(error)));
    }
  });
}
