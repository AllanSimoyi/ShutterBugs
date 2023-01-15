import { IconButton } from '@chakra-ui/react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

interface Props {
  imageUrls: {
    src: string;
  }[]
  maxH?: number | string;
}

export function ImageCarousel (props: Props) {
  const { imageUrls, maxH } = props;

  return (
    <Carousel
      images={imageUrls}
      canAutoPlay={false}
      objectFit="cover"
      hasThumbnails={false}
      hasDotButtons="bottom"
      hasIndexBoard={false}
      hasSizeButton={false}
      isLoop={true}
      shouldMaximizeOnClick={true}
      shouldMinimizeOnClick={true}
      leftIcon={(
        <IconButton
          aria-label='Previous Image'
          size="sm"
          borderRadius={"50%"}
          icon={<ChevronLeft />}
          m={2}
        />
      )}
      rightIcon={(
        <IconButton
          aria-label='Next Image'
          size="sm"
          borderRadius={"50%"}
          icon={<ChevronRight />}
          m={2}
        />
      )}
      style={maxH ? { flexGrow: 1, maxHeight: maxH } : undefined}
    />
  )
}