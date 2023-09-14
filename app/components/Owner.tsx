import type { ComponentProps } from 'react';

import { fill } from '@cloudinary/url-gen/actions/resize';
import { useMemo } from 'react';
import { User } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';

import { useCloudinary } from './CloudinaryContextProvider';

interface Props extends ComponentProps<'div'> {
  imageId: string;
  fullName: string;
  createdAt: string;
}
export function Owner(props: Props) {
  const { imageId, fullName, createdAt, className, ...restOfProps } = props;

  const { CloudinaryUtil } = useCloudinary();

  const imageUrl = useMemo(() => {
    if (!imageId) {
      return '';
    }
    return CloudinaryUtil.image(imageId)
      .resize(fill().aspectRatio('1:1').width(72).height(72))
      .format('auto')
      .quality('auto')
      .toURL();
  }, [imageId, CloudinaryUtil]);

  return (
    <div
      className={twMerge(
        'flex flex-row items-center gap-4 rounded-lg',
        className
      )}
      {...restOfProps}
    >
      {!!imageUrl && (
        <img
          src={imageUrl}
          alt={fullName}
          className="h-12 w-12 rounded-full object-cover"
        />
      )}
      {!imageUrl && (
        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-stone-200">
          <User className="text-xl font-semibold text-stone-800" />
        </div>
      )}
      <div className="flex flex-col items-start">
        <span className="text-base font-semibold tracking-wider">
          {fullName}
        </span>
        <span className="text-xs font-normal">{createdAt}</span>
      </div>
    </div>
  );
}
