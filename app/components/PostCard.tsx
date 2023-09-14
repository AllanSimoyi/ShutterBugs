import 'react-gallery-carousel/dist/index.css';

import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { Link } from '@remix-run/react';
import { useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { AppLinks } from '~/lib/links';

import { useCloudinary } from './CloudinaryContextProvider';
import { Desc } from './Desc';
import { Owner } from './Owner';

interface Props {
  createdAt: string;
  postId: string;
  imageId: string;
  desc: string | undefined;
  owner: { id: string; imageId: string; fullName: string };
}

export function PostCard(props: Props) {
  const { createdAt, postId, imageId, desc, owner } = props;
  const { CloudinaryUtil } = useCloudinary();

  const getCloudinaryImage = useCallback(
    (imageId: string, large: boolean) => {
      const imageSize = large ? 400 : 72;
      const resized = CloudinaryUtil.image(imageId).resize(
        fill().aspectRatio('1:1').width(imageSize).height(imageSize)
      );
      const rounded = large ? resized.roundCorners(byRadius(5)) : resized;
      return rounded.format('auto').quality('auto').toURL();
    },
    [CloudinaryUtil]
  );

  const postImage = useMemo(() => {
    return getCloudinaryImage(imageId, true);
  }, [getCloudinaryImage, imageId]);

  return (
    <Link
      to={AppLinks.Post(postId)}
      className={twMerge(
        'group flex h-[80vh] flex-col items-stretch rounded-md bg-cover bg-bottom bg-no-repeat',
        'transition-all duration-300 hover:ring-2 hover:ring-stone-600'
      )}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(225, 225, 225, 0), rgba(0, 0, 0, 0.9)), url('${postImage}')`,
      }}
    >
      <Owner {...owner} createdAt={createdAt} className="p-4 text-white" />
      <div className="grow" />
      {desc && (
        <div className="flex flex-col items-start p-4">
          <Desc>{desc}</Desc>
        </div>
      )}
    </Link>
  );
}
