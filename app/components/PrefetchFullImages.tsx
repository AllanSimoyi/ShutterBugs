import { useFullImage } from '~/hooks/useFullImage';

interface Props {
  imageIds: string[];
}
export function PrefetchFullImages(props: Props) {
  const { imageIds } = props;
  return (
    <>
      {imageIds.map((imageId) => (
        <PrefetchedImage key={imageId} imageId={imageId} />
      ))}
    </>
  );
}

function PrefetchedImage({ imageId }: { imageId: string | undefined }) {
  const imageUrl = useFullImage(imageId);
  return (
    <img
      src={imageUrl}
      alt="Post"
      className="invisible absolute left-0 top-0"
    />
  );
}
