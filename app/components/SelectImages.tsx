import { SimpleGrid, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useUploadCloudinaryImage } from "~/hooks/useUploadCloudinaryImage";
import { MAX_NUM_IMAGES } from "~/lib/property.validations";
import { useField } from "./ActionContextProvider";
import { CustomAlert } from "./CustomAlert";
import { RecordsNotFound } from "./RecordsNotFound";
import { RemovableImage } from "./RemovableImage";
import { SeveralErrors } from "./SeveralErrors";
import { UploadImage } from "./UploadImage";

interface Props {
  isProcessing: boolean;
}

export function SelectImages ({ isProcessing }: Props) {
  const { value, error: errors } = useField<string[]>("imageIds");
  const initialValue: string[] = typeof value === "string" ?
    JSON.parse(value) :
    [];
  const [selectedImages, setSelectedImages] = useState<string[]>(initialValue);

  console.log("mage value", value);

  const propertyImage = useUploadCloudinaryImage({
    initialPublicId: "",
    onChange: (newPublicId, clearPublicId) => {
      if (selectedImages.length === MAX_NUM_IMAGES) {
        return window.alert(`You've reached the max number of images allowed (${MAX_NUM_IMAGES})`);
      }
      setSelectedImages(prevState => [...prevState, newPublicId]);
      clearPublicId();
    }
  });

  const preppedImages = selectedImages.map(imageId => ({
    imageId,
    handleRemove: () => {
      setSelectedImages(prevState => {
        return prevState.filter(el => el !== imageId);
      });
    }
  }));

  return (
    <VStack align="stretch">
      <input
        type="hidden"
        name="imageIds"
        value={JSON.stringify(selectedImages)}
      />
      {errors?.length && (
        <CustomAlert status="error" py={4}>
          <SeveralErrors errors={errors} />
        </CustomAlert>
      )}
      <UploadImage
        {...propertyImage}
        identifier={"Image"}
      />
      {!selectedImages.length && (
        <RecordsNotFound imageHeight={40}>
          No images selected
        </RecordsNotFound>
      )}
      {selectedImages.length && (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 4, "2xl": 6 }} spacing={6}>
          {preppedImages.map(({ imageId, handleRemove }) => (
            <RemovableImage
              key={imageId}
              imageId={imageId}
              handleRemove={handleRemove}
              isProcessing={isProcessing}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  )
}