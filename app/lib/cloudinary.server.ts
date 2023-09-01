import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';

import { Env } from './environment';

export function genImageUrl(imageId: string) {
  const CloudinaryUtil = new Cloudinary({
    cloud: { cloudName: Env.CLOUDINARY_CLOUD_NAME },
  });
  return CloudinaryUtil.image(imageId)
    .resize(fill().aspectRatio('1:1').width(400).height(400))
    .roundCorners(byRadius(5))
    .format('auto')
    .quality('auto')
    .toURL();
}
