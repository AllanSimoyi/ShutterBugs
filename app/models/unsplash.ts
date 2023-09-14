import { createApi } from 'unsplash-js';

import { Env } from '~/lib/environment';

const unsplash = createApi({
  accessKey: Env.UNSPLASH_KEY,
});

export async function fetchUnsplashImages() {
  const result = await unsplash.photos.list({});
  console.log('result', result);
}
