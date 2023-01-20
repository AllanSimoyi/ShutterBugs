import { HStack, IconButton, Spacer, Text, useColorMode, VStack } from "@chakra-ui/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { useCallback, useMemo } from "react";
import { useCloudinary } from "remix-chakra-reusables";
import { X } from "tabler-icons-react";
import { getLiteTextColor } from "~/lib/text";

interface Props {
  isUploading: boolean;
  imageId: string;
  handleRemove: (imageId: string) => void;
}

export function ImageUpload (props: Props) {
  const { isUploading, imageId, handleRemove } = props;

  const { CloudinaryUtil } = useCloudinary();
  const { colorMode } = useColorMode();

  const imageUrl = useMemo(() => {
    if (imageId) {
      return CloudinaryUtil
        .image(imageId)
        .resize(thumbnail(240, 240))
        .format('auto')
        .quality('auto')
        .toURL();
    }
    return "";
  }, [CloudinaryUtil, imageId]);

  const handleRemoveClick = useCallback((_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleRemove(imageId);
  }, [handleRemove, imageId]);

  return (
    <VStack
      h={isUploading ? undefined : 240}
      w="100%"
      borderWidth={1}
      align="stretch"
      bgSize="cover"
      borderRadius={10}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgImage={imageUrl || undefined}
      borderColor={getLiteTextColor(colorMode)}
    >
      <HStack align="center" p={2}>
        {isUploading && (
          <Text fontSize="lg">
            Uploading...
          </Text>
        )}
        <Spacer />
        {!isUploading && (
          <IconButton
            size={"md"}
            icon={<X />}
            color="red.400"
            bgColor="white"
            variant="solid"
            borderRadius={10}
            aria-label="Remove Image"
            onClick={handleRemoveClick}
          />
        )}
      </HStack>
    </VStack>
  )
}