import { createApi } from 'unsplash-js';

(async () => {
  const unsplash = createApi({
    accessKey: 'KCYnq4usY2gfRU0UPOatFBHXTjrrh6k8vWZKgDb68kA',
  });
  async function fetchUnsplashImages() {
    const result = await unsplash.photos.list({});
    const page = result.response?.results
      .slice(0, 20)
      .map((el) => el.urls.full);
    console.log('page', page);
  }
  await fetchUnsplashImages();
})();
