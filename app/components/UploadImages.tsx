import type { ChangeEvent } from 'react';
import type { ImageUploadState } from '~/hooks/useUploadImages';

import { Divider } from '@chakra-ui/react';
import { useCallback } from 'react';

import { UploadState } from '~/lib/cloudinary';

import { useField } from './ActionContextProvider';
import { AddImage } from './AddImage';
import { EmptyList } from './EmptyList';
import { ImageUpload } from './ImageUpload';
import { InlineAlert } from './InlineAlert';

interface Props extends ImageUploadState {
  removeImage: () => void;
  uploadImage: (files: File) => Promise<void>;
}

export function UploadImages(props: Props) {
  const { imageId, uploadState, uploadError, removeImage, uploadImage } = props;

  const { error: imageIdErrors } = useField('imageId');

  const joinedErrors = [imageIdErrors?.join(', ') || '', uploadError]
    .filter(Boolean)
    .join(', ');

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const arr = Array.from(event.target.files);
        if (arr.length) {
          uploadImage(arr[0]);
        }
      }
    },
    [uploadImage]
  );

  return (
    <div className="relative flex grow flex-col items-stretch gap-0 divide-y divide-stone-400">
      <div className="flex grow flex-col items-stretch justify-center p-4">
        {!!joinedErrors && <InlineAlert>{joinedErrors}</InlineAlert>}
        {!imageId && (
          <label htmlFor="file">
            <EmptyList message="No image selected yet" />
          </label>
        )}
        {!!imageId && (
          <div className="flex grow flex-col items-stretch overflow-y-auto">
            <ImageUpload
              handleRemove={removeImage}
              imageId={imageId}
              isUploading={uploadState === UploadState.Uploading}
            />
          </div>
        )}
      </div>
      <Divider />
      <div className="flex flex-col items-stretch bg-transparent p-4">
        <AddImage handleChange={handleChange} />
      </div>
    </div>
  );
}
