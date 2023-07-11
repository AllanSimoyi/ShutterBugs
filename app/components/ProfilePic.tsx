import { Avatar } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useCloudinary } from './CloudinaryContextProvider';

interface Props {
  imageId: string | undefined;
  fullName: string;
  large?: boolean;
}

export function ProfilePic(props: Props) {
  const { imageId, fullName, large } = props;
  const { CloudinaryUtil } = useCloudinary();

  const imageSrc = useMemo(() => {
    if (!imageId) {
      return undefined;
    }
    return CloudinaryUtil.image(imageId).format('auto').quality('auto').toURL();
  }, [imageId, CloudinaryUtil]);

  return <Avatar name={fullName} src={imageSrc} size={large ? '2xl' : 'md'} />;
}
