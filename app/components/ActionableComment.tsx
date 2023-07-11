import { useToast } from '@chakra-ui/react';
import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';

import { hasErrorMessage } from '~/lib/forms';

import { LikeComment } from './LikeComment';
import { NumLikes } from './NumLikes';
import { ProfilePic } from './ProfilePic';

interface Props {
  id: string;
  userImageId: string;
  userFullName: string;
  content: string;
  numLikes: number;
  likedByCurrentUser: boolean;
  createdAt: string;
}

export function ActionableComment(props: Props) {
  const {
    id,
    userImageId,
    userFullName,
    content,
    numLikes,
    likedByCurrentUser,
    createdAt,
  } = props;

  const fetcher = useFetcher();
  const toast = useToast();

  const isTogglingLike = fetcher.state !== 'idle';

  const effectiveNumLikes = isTogglingLike
    ? likedByCurrentUser
      ? numLikes - 1
      : numLikes + 1
    : numLikes;

  useEffect(() => {
    if (hasErrorMessage(fetcher.data)) {
      toast({
        title: fetcher.data.errorMessage,
        status: 'error',
        isClosable: true,
      });
    }
  }, [fetcher.data, toast]);

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex shrink-0 flex-col items-stretch">
        <ProfilePic imageId={userImageId} fullName={userFullName} />
      </div>
      <div className="flex flex-col items-stretch gap-0">
        <span className="text-xs lg:text-sm">
          <b>{userFullName}</b> {content.substring(0, 40)}
        </span>
        <span className="text-xs text-stone-400">
          {createdAt} &middot; <NumLikes>{effectiveNumLikes}</NumLikes>
        </span>
      </div>
      <div className="grow" />
      <fetcher.Form method="post">
        <LikeComment
          commentId={id}
          likedByCurrentUser={
            isTogglingLike ? !likedByCurrentUser : likedByCurrentUser
          }
        />
      </fetcher.Form>
    </div>
  );
}
