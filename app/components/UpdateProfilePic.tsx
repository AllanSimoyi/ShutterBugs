import type { ChangeEvent } from 'react';

import { Avatar, keyframes } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { UploadState, useCloudinary } from 'remix-chakra-reusables';

import { FILE_INPUT_STYLE } from '~/lib/constants';

interface Props {
  identifier: string;
  fullName: string;
  imageId: string;
  onChange: (files: [File]) => void;
  uploadState: UploadState;
  uploadError: string;
  isProcessing: boolean;
}

const pulsate = keyframes`
  0% { border-color: rgba(0, 255, 0, 1); }
  50% { border-color: rgba(0, 255, 0, 0.2); }
  100% { border-color: rgba(0, 255, 0, 1); }
`;

export function UpdateProfilePic(props: Props) {
  const { identifier, fullName, imageId, onChange, uploadState, isProcessing } =
    props;

  const { CloudinaryUtil } = useCloudinary();

  const [uploadingImage, setUploadingImage] = useState<string | undefined>(
    undefined
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e) => {
          console.log(typeof e.target?.result);
          if (e.target?.result && typeof e.target?.result === 'string') {
            setUploadingImage(e.target?.result);
          }
        };
        onChange([event.target.files[0]!]);
      }
    },
    [onChange]
  );

  const imageSrc = useMemo(() => {
    return CloudinaryUtil.image(imageId).format('auto').quality('auto').toURL();
  }, [imageId, CloudinaryUtil]);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        id={identifier}
        onChange={handleChange}
        disabled={isProcessing}
        style={FILE_INPUT_STYLE}
      />
      {uploadState !== UploadState.Uploading && (
        <label htmlFor={identifier}>
          <Avatar cursor="pointer" size="2xl" name={fullName} src={imageSrc} />
        </label>
      )}
      {uploadState === UploadState.Uploading && (
        <Avatar
          size="2xl"
          name={fullName}
          src={uploadingImage}
          borderWidth={4}
          animation={`${pulsate} infinite 2s ease-out`}
        />
      )}
    </>
  );
}
