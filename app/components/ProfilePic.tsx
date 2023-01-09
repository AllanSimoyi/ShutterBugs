import { Avatar, VStack } from "@chakra-ui/react";
import { AdvancedImage, placeholder } from "@cloudinary/react";
import { cloudinaryImages, useCloudinary } from "remix-chakra-reusables";

interface Props {
  imageId: string;
  fullName: string;
}

export function ProfilePic (props: Props) {
  const { imageId, fullName } = props;
  const { CLOUDINARY_CLOUD_NAME } = useCloudinary();

  return (
    <VStack align="stretch">
      {imageId && (
        <VStack
          justify="center"
          align="center"
          borderRadius="50%"
          overflow="hidden"
          maxH="40px"
          maxW="40px"
          p={0}
          >
          <AdvancedImage
            cldImg={cloudinaryImages(CLOUDINARY_CLOUD_NAME).getUploadThumbnail(imageId, 60, 60)}
            plugins={[placeholder({ mode: 'blur' })]}
          />
        </VStack>
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