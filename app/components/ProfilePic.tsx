import { Avatar } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useCloudinary } from 'remix-chakra-reusables';

interface Props {
  imageId: string | undefined;
  fullName: string;
  large?: boolean;
}

export function ProfilePic(props: Props) {
  const { imageId, fullName, large } = props;
  const { CloudinaryUtil } = useCloudinary();

  const imageSrc = useMemo(() => {
    return imageId
      ? CloudinaryUtil.image(imageId).format('auto').quality('auto').toURL()
      : '';
  }, [imageId, CloudinaryUtil]);

  return <Avatar name={fullName} src={imageSrc} size={large ? '2xl' : 'md'} />;
}
