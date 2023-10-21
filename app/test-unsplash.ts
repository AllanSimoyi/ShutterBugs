import { createApi } from 'unsplash-js';

(async () => {
  const unsplash = createApi({
    accessKey: 'KCYnq4usY2gfRU0UPOatFBHXTjrrh6k8vWZKgDb68kA',
  });
  async function fetchUnsplashImages() {
    const result = await unsplash.photos.list({});
    const page = result.response?.results.slice(0, 500).map((el) => {
      console.log(el.user);
      return el.urls.full;
    });
    return page || [];
  }
  for (let i = 0; i < 40; i++) {
    const urls = await fetchUnsplashImages();
    console.log(urls);
  }
})();
