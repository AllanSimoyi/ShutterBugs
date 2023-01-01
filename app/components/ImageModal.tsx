import {
  HStack,
  IconButton,
  Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, Spacer, Text, VStack
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import { cloudinaryImages } from '~/lib/images';
import { useCloudinary } from './CloudinaryContextProvider';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onPrevious: () => void;
  onNext: () => void;
  imageId: string;
  imageNumber: number;
  numImages: number;
}

export function ImageModal (props: Props) {
  const { isOpen, onClose, onPrevious, onNext, imageId, imageNumber, numImages } = props;
  const { CLOUDINARY_CLOUD_NAME } = useCloudinary();

  return (
    <Modal
      isCentered
      size="full"
      isOpen={isOpen}
      onClose={onClose || (() => undefined)}
    >
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px)'
      />
      <ModalContent bgColor="blackAlpha.800">
        <ModalHeader>
          <VStack justify="center" align="center">
            <Text fontSize="2xl" fontWeight="bold" color="white">
              {imageNumber} / {numImages}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton size="4xl" color="white" />
        <ModalBody>
          <VStack minH="100%" w="100%" justify="stretch" align="center">
            <HStack
              align="center"
              borderRadius={"lg"}
              overflow="hidden"
              flexGrow={1}
              h="85vh"
              w="80vw"
              bgRepeat="no-repeat"
              bgPosition="center"
              bgImage={cloudinaryImages(CLOUDINARY_CLOUD_NAME).getFullImage(imageId).toURL()}
            >
              <VStack justify="center" align="center" p={6}>
                <IconButton
                  size="lg"
                  aria-label='Search database'
                  icon={<ChevronLeft />}
                  onClick={onPrevious}
                />
              </VStack>
              <Spacer />
              <VStack justify="center" align="center" p={6}>
                <IconButton
                  size="lg"
                  aria-label='Search database'
                  icon={<ChevronRight />}
                  onClick={onNext}
                />
              </VStack>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal >
  )
}

// import {
//   HStack,
//   IconButton,
//   Modal, ModalBody,
//   ModalCloseButton, ModalContent,
//   ModalHeader, ModalOverlay, Spacer, Text, VStack
// } from '@chakra-ui/react';
// import { AdvancedImage, placeholder } from '@cloudinary/react';
// import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
// import { cloudinaryImages } from '~/lib/images';
// import { useCloudinary } from './CloudinaryContextProvider';

// interface Props {
//   isOpen: boolean;
//   onClose?: () => void;
//   onPrevious: () => void;
//   onNext: () => void;
//   imageId: string;
//   imageNumber: number;
//   numImages: number;
// }

// export function ImageModal (props: Props) {
//   const { isOpen, onClose, onPrevious, onNext, imageId, imageNumber, numImages } = props;
//   const { CLOUDINARY_CLOUD_NAME } = useCloudinary();

//   return (
//     <Modal
//       isCentered
//       size="full"
//       isOpen={isOpen}
//       onClose={onClose || (() => undefined)}
//     >
//       <ModalOverlay
//         bg='blackAlpha.300'
//         backdropFilter='blur(10px)'
//       />
//       <ModalContent bgColor="blackAlpha.800">
//         <ModalHeader>
//           <VStack justifyContent="center" alignItems="center">
//             <Text fontSize="2xl" fontWeight="bold" color="white">
//               {imageNumber} / {numImages}
//             </Text>
//           </VStack>
//         </ModalHeader>
//         <ModalCloseButton color="white" />
//         <ModalBody>
//           <VStack h="100%" justify="center" align="stretch">
//             <HStack justify="center" alignItems="stretch">
//               <VStack justify="center" align="center" p={6}>
//                 <IconButton
//                   size="lg"
//                   aria-label='Search database'
//                   icon={<ChevronLeft />}
//                   onClick={onPrevious}
//                 />
//               </VStack>
//               <Spacer />
//               <VStack
//                 align="stretch"
//                 borderRadius={"lg"}
//                 overflow="hidden"
//                 minH={"200px"}
//                 bgImage={cloudinaryImages(CLOUDINARY_CLOUD_NAME).getFullImage(imageId).toURL()}
//               >
//                 {/* <AdvancedImage
//                   cldImg={cloudinaryImages(CLOUDINARY_CLOUD_NAME).getFullImage(imageId)}
//                   plugins={[placeholder({ mode: 'pixelate' })]}
//                 /> */}
//               </VStack>
//               <Spacer />
//               <VStack justify="center" align="center" p={6}>
//                 <IconButton
//                   size="lg"
//                   aria-label='Search database'
//                   icon={<ChevronRight />}
//                   onClick={onNext}
//                 />
//               </VStack>
//             </HStack>
//           </VStack>
//         </ModalBody>
//       </ModalContent>
//     </Modal >
//   )
// }