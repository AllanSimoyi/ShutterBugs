import 'react-gallery-carousel/dist/index.css';

import { source } from '@cloudinary/url-gen/actions/overlay';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { Position } from '@cloudinary/url-gen/qualifiers';
import { compass } from '@cloudinary/url-gen/qualifiers/gravity';
import { text } from '@cloudinary/url-gen/qualifiers/source';
import { TextStyle } from '@cloudinary/url-gen/qualifiers/textStyle';
import { useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

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
  const { createdAt, imageId, desc, owner } = props;
  const { CloudinaryUtil } = useCloudinary();

  const getCloudinaryImage = useCallback(
    (imageId: string, large: boolean) => {
      const base = CloudinaryUtil.image(imageId);

      const baseResize = fill().aspectRatio('1:1');
      const imageSize = large ? undefined : 400;
      const resized = imageSize
        ? base.resize(baseResize.width(imageSize).height(imageSize))
        : base
            .resize(baseResize)
            .overlay(
              source(
                text(owner.fullName, new TextStyle('Poppins', 75)).textColor(
                  '#ffffff60'
                )
              ).position(new Position().gravity(compass('south')).offsetY(40))
            );

      const rounded = large ? resized.roundCorners(byRadius(5)) : resized;
      return rounded.format('auto').quality('auto').toURL();
    },
    [CloudinaryUtil, owner.fullName]
  );

  const [postImage, fullPostImage] = useMemo(() => {
    return [
      getCloudinaryImage(imageId, false),
      getCloudinaryImage(imageId, true),
    ];
  }, [getCloudinaryImage, imageId]);

  return (
    <a
      href={fullPostImage}
      target="_blank"
      rel="noopener noreferrer"
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
    </a>
  );
}
