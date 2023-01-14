import { Avatar, Img, VStack } from "@chakra-ui/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { useMemo } from "react";
import { Cld } from "~/lib/cloudinary";

interface Props {
  imageId: string;
  fullName: string;
}

export function ProfilePic (props: Props) {
  const { imageId, fullName } = props;

  const imageSrc = useMemo(() => {
    return Cld
      .image(imageId)
      .resize(thumbnail().width(60).height(60))
      .format('auto')
      .quality('auto')
      .toURL()
  }, [imageId]);

  return (
    <VStack align="stretch">
      {imageId && (
        <Img
          src={imageSrc}
          width="60px"
          height="60px"
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