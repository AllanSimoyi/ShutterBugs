import { NumLikes } from './NumLikes';
import { ProfilePic } from './ProfilePic';

export interface UserPicHeaderProps {
  userImageId: string;
  userFullName: string;
  numLikes: number;
}

export function UserPicHeader(props: UserPicHeaderProps) {
  const { userImageId, userFullName, numLikes } = props;

  return (
    <div className="flex flex-row items-center gap-4">
      <ProfilePic imageId={userImageId} fullName={userFullName} />
      <div className="flex flex-col items-start gap-0">
        <span className="text-sm font-bold">{userFullName}</span>
        <span className="text-sm">
          <NumLikes>{numLikes}</NumLikes>
        </span>
      </div>
    </div>
  );
}
