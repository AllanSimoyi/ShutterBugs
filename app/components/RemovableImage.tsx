import { VStack } from "@chakra-ui/react";
import { AdvancedImage, placeholder } from "@cloudinary/react";
import { cloudinaryImages } from "~/lib/images";
import { useCloudinary } from "./CloudinaryContextProvider";
import { OutlinedButton } from "./OutlinedButton";

interface Props {
  imageId: string;
  handleRemove: () => void;
  isProcessing: boolean;
}

export function RemovableImage (props: Props) {
  const { imageId, isProcessing, handleRemove } = props;
  const { CLOUDINARY_CLOUD_NAME } = useCloudinary();
  return (
    <VStack align="stretch">
      <AdvancedImage
        cldImg={cloudinaryImages(CLOUDINARY_CLOUD_NAME).getThumbnail(imageId)}
        plugins={[placeholder({ mode: 'pixelate' })]}
      />
      <OutlinedButton isDisabled={isProcessing} onClick={handleRemove}>
        Remove
      </OutlinedButton>
    </VStack>
  )
}