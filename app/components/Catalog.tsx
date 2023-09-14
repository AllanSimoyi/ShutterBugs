import type { ComponentProps } from 'react';

import { EmptyList } from './EmptyList';
import { PostCard } from './PostCard';
import { PrefetchFullImages } from './PrefetchFullImages';

interface Props {
  posts: ComponentProps<typeof PostCard>[];
}

export function Catalog(props: Props) {
  const { posts } = props;

  return (
    <>
      <PrefetchFullImages imageIds={posts.map((post) => post.imageId)} />
      {!!posts.length && (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.postId} {...post} />
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
