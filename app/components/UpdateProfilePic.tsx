import type { ChangeEvent } from 'react';
import type { UploadState } from 'remix-chakra-reusables';

import { Avatar, AvatarBadge, Icon } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useCloudinary } from 'remix-chakra-reusables';
import { Edit } from 'tabler-icons-react';

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

export function UpdateProfilePic(props: Props) {
  const { identifier, fullName, imageId, onChange, uploadState, isProcessing } =
    props;

  const { CloudinaryUtil } = useCloudinary();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
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
      <Avatar size="2xl" name={fullName} src={imageSrc}>
        <input
          type="file"
          accept="image/*"
          id={identifier}
          onChange={handleChange}
          disabled={isProcessing}
          style={FILE_INPUT_STYLE}
        />
        <label htmlFor={identifier}>
          <AvatarBadge
            cursor="pointer"
            boxSize="1.25em"
            borderColor="transparent"
            bg="white"
          >
            <Icon as={Edit} w={10} h={10} />
          </AvatarBadge>
        </label>
      </Avatar>
    </>
  );
}
