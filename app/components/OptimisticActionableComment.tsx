import { ProfilePic } from './ProfilePic';

interface Props {
  userImageId: string;
  userFullName: string;
  content: string;
}

export function OptimisticActionableComment(props: Props) {
  const { userImageId, userFullName, content } = props;

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex shrink-0 flex-col items-stretch">
        <ProfilePic imageId={userImageId} fullName={userFullName} />
      </div>
      <div className="flex flex-col items-stretch gap-0">
        <span className="text-xs lg:text-sm">
          <b>{userFullName}</b> {content.substring(0, 40)}
        </span>
        <span className="text-xs text-stone-400">Processing...</span>
      </div>
    </div>
  );
}
