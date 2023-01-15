import { Avatar, Img, VStack } from "@chakra-ui/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { useMemo } from "react";
import { useCloudinary } from "remix-chakra-reusables";

interface Props {
  imageId: string;
  fullName: string;
}

export function ProfilePic (props: Props) {
  const { imageId, fullName } = props;
  const { CloudinaryUtil } = useCloudinary();

  const imageSrc = useMemo(() => {
    return CloudinaryUtil
      .image(imageId)
      .resize(thumbnail().width(60).height(60))
      .format('auto')
      .quality('auto')
      .toURL()
  }, [imageId, CloudinaryUtil]);

  return (
    <VStack align="stretch">
      {imageId && (
        <Img
          src={imageSrc}
          width="40px"
          height="40px"
          borderRadius='full'
        />
      )}
      {!imageId && (
        <Avatar
          name={fullName || ""}
          src={""}
        />
      )}
    </VStack>
  )
}