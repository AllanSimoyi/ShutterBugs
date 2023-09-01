import 'react-gallery-carousel/dist/index.css';

import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { useMemo } from 'react';
import { InfoCircle } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';

import { capitalize } from '~/lib/strings';

import { useCloudinary } from './CloudinaryContextProvider';

interface Props {
  postId: string;
  imageId: string;
  description: string | undefined;
  createdAt: string;
  owner: {
    id: string;
    imageId: string;
    name: string;
  };
  onSelect: () => void;
}

export function PostCard(props: Props) {
  const { imageId, description, createdAt, owner, onSelect } = props;

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
    <button
      type="button"
      onClick={onSelect}
      className={twMerge(
        'group flex h-[80vh] flex-col items-stretch rounded-md bg-gradient-to-r from-black bg-cover bg-bottom bg-no-repeat',
        'transition-all duration-300 hover:scale-[101%] hover:ring-stone-600'
      )}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(225, 225, 225, 0), rgba(0, 0, 0, 0.9)), url('${postImage}')`,
      }}
    >
      {description && (
        <div className="flex flex-col items-start p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span
            className={twMerge(
              'bg-white/40 p-2 text-start text-sm font-normal tracking-wider text-stone-800',
              'flex flex-row items-start gap-2 rounded-xl'
            )}
          >
            <InfoCircle size={20} />
            <span>{capitalize(description)}</span>
          </span>
        </div>
      )}
      <div className="grow" />
      <div className="flex flex-row items-center gap-4 p-4 text-white">
        <img
          src={ownerImage}
          alt={owner.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <span className="text-base tracking-wider">{owner.name}</span>
          <span className="text-xs font-light">{createdAt}</span>
        </div>
      </div>
    </button>
  );
}
