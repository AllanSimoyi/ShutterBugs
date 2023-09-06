import { useMemo } from 'react';

import { useCloudinary } from './CloudinaryContextProvider';

interface Props {
  imageId: string | undefined;
  fullName: string;
}

export function ProfilePic(props: Props) {
  const { imageId, fullName } = props;
  const { CloudinaryUtil } = useCloudinary();

  const imageSrc = useMemo(() => {
    if (!imageId) {
      return undefined;
    }
    return CloudinaryUtil.image(imageId).format('auto').quality('auto').toURL();
  }, [imageId, CloudinaryUtil]);

  return (
    <img
      alt={fullName}
      src={imageSrc}
      className="h-36 w-36 rounded-full border-2 border-white object-cover"
    />
  );
}
