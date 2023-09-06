import { z } from 'zod';

import { useCloudinary } from '~/components/CloudinaryContextProvider';
import { getErrorMessage } from '~/lib/errors';

export function useCloudinaryUpload() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_RESET } = useCloudinary();

  return async function (file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_RESET);
    formData.append('tags', 'rte');
    formData.append('context', '');

    try {
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      }).then((response) => response.json());
      if (!response) {
        throw new Error('Failed to upload image, please try again');
      }

      const result = await validateResponse(response);
      if (result instanceof Error) {
        throw result;
      }
      return result;
    } catch (error) {
      return new Error(getErrorMessage(error));
    }
  };
}

function validateResponse(data: unknown) {
  const ResponseSchema = z.object({
    public_id: z.string().min(1).max(100),
    url: z.string().min(1).max(800),
    width: z.number(),
    height: z.number(),
  });
  const result = ResponseSchema.safeParse(data);
  if (!result.success) {
    return new Error(
      'Received invalid response from our image database, please contact the developer'
    );
  }
  const { public_id, ...details } = result.data;
  return { ...details, publicId: public_id } as const;
}
