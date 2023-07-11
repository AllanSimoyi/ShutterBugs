import { Avatar } from '@chakra-ui/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { useMemo } from 'react';
import 'react-gallery-carousel/dist/index.css';

import { useCloudinary } from './CloudinaryContextProvider';

interface Props {
  postId: string;
  imageId: string;
  createdAt: string;
  owner: {
    id: string;
    imageId: string;
    name: string;
  };
}

export function PostCard(props: Props) {
  const { imageId, createdAt, owner } = props;

  const { CloudinaryUtil } = useCloudinary();

  const postImage = useMemo(() => {
    return CloudinaryUtil.image(imageId)
      .resize(fill().aspectRatio('1:1').width(400).height(400))
      .roundCorners(byRadius(5))
      .format('auto')
      .quality('auto')
      .toURL();
  }, [CloudinaryUtil, imageId]);

  const ownerImage = useMemo(() => {
    return CloudinaryUtil.image(owner.imageId)
      .resize(fill().aspectRatio('1:1').width(72).height(72))
      .format('auto')
      .quality('auto')
      .toURL();
  }, [CloudinaryUtil, owner.imageId]);

  return (
    <div
      className="flex h-[80vh] flex-col items-stretch rounded-md bg-gradient-to-r from-black bg-cover bg-bottom bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(225, 225, 225, 0), rgba(0, 0, 0, 0.9)), url('${postImage}')`,
      }}
    >
      <div className="grow" />
      <div className="flex flex-row items-center gap-4 p-4 text-white">
        <Avatar name={owner.name} src={ownerImage} size="md" />
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold">{owner.name}</span>
          <span className="text-xs font-thin">{createdAt}</span>
        </div>
      </div>
    </div>
  );
}
