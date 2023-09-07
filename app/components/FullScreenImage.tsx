import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { twMerge } from 'tailwind-merge';

import { useFullImage } from '~/hooks/useFullImage';

interface Props {
  close: () => void;
  post: string | undefined;
}
export function FullScreenImage(props: Props) {
  const { post, close } = props;

  const postImage = useFullImage(post);

  return (
    <Transition appear show={!!post} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg"
            onClick={close}
          />
        </Transition.Child>

        <div
          className="fixed inset-0 flex h-full items-center justify-center overflow-y-auto p-4 text-center"
          onClick={close}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={twMerge(
                'h-full overflow-hidden rounded-md bg-transparent align-middle md:h-full',
                'transform shadow-xl transition-all duration-300',
                'flex max-h-full flex-row items-center justify-center'
              )}
            >
              {!!postImage && (
                <TransformWrapper>
                  <TransformComponent
                    wrapperClass="min-h-full"
                    contentClass="min-h-full flex flex-col justify-center items-center"
                  >
                    <img
                      src={postImage}
                      alt="Post"
                      className="h-full object-contain"
                    />
                  </TransformComponent>
                </TransformWrapper>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
