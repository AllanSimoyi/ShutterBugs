import 'react-gallery-carousel/dist/index.css';

import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { useCallback, useMemo } from 'react';
import { InfoCircle } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';

import { capitalize } from '~/lib/strings';

import { useCloudinary } from './CloudinaryContextProvider';

type BaseProps = {
  postId: string;
  imageId: string;
  desc: string | undefined;
  onSelect: () => void;
};

type Props =
  | ({ owner: undefined } & BaseProps)
  | ({
      owner: { id: string; imageId: string; fullName: string };
      createdAt: string;
    } & BaseProps);

export function PostCard(props: Props) {
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
    return getCloudinaryImage(props.imageId, true);
  }, [getCloudinaryImage, props.imageId]);

  const ownerImage = useMemo(() => {
    if (!props.owner) {
      return '';
    }
    return getCloudinaryImage(props.owner.imageId, false);
  }, [getCloudinaryImage, props.owner]);

  return (
    <button
      type="button"
      onClick={props.onSelect}
      className={twMerge(
        'group flex h-[80vh] flex-col items-stretch rounded-md bg-cover bg-bottom bg-no-repeat',
        'transition-all duration-300 hover:ring-2 hover:ring-stone-600'
      )}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(225, 225, 225, 0), rgba(0, 0, 0, 0.9)), url('${postImage}')`,
      }}
    >
      {!!props.owner && (
        <div className="flex flex-col items-stretch p-4">
          <div className="flex flex-row items-center gap-4 rounded-lg p-2 text-white">
            <img
              src={ownerImage}
              alt={props.owner.fullName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex flex-col items-start">
              <span className="text-base tracking-wider">
                {props.owner.fullName}
              </span>
              <span className="text-xs font-normal">{props.createdAt}</span>
            </div>
          </div>
        </div>
      )}
      <div className="grow" />
      {props.desc && (
        <div className="flex flex-col items-start p-4 transition-all duration-300">
          <span
            className={twMerge(
              'bg-black/40 p-2 text-start text-sm font-normal tracking-wider text-white/80',
              'flex flex-row items-start gap-2 rounded-lg'
            )}
          >
            <InfoCircle size={20} />
            <span>{capitalize(props.desc)}</span>
          </span>
        </div>
      )}
    </button>
  );
}
