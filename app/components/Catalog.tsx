import type { ComponentProps } from 'react';

import { useCallback, useState } from 'react';

import { EmptyList } from './EmptyList';
import { FullScreenImage } from './FullScreenImage';
import { PostCard } from './PostCard';

interface Props {
  posts: ComponentProps<typeof PostCard>[];
}

export function Catalog(props: Props) {
  const { posts } = props;

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const openFullScreenImage = useCallback((post: string) => {
    setSelectedImage(post);
  }, []);

  const closeFullScreenImage = useCallback(() => {
    setSelectedImage(undefined);
  }, []);

  return (
    <>
      <FullScreenImage post={selectedImage} close={closeFullScreenImage} />
      {!!posts.length && (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.postId} className="flex flex-col items-stretch">
              <PostCard
                {...post}
                onSelect={() => openFullScreenImage(post.imageId)}
              />
            </div>
          ))}
        </div>
      )}
      {!posts.length && (
        <div className="flex flex-col items-stretch justify-center">
          <EmptyList message="No photos found" />
        </div>
      )}
    </>
  );
}
