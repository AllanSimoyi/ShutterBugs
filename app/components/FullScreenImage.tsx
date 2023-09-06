import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { useCloudinary } from './CloudinaryContextProvider';

interface Props {
  close: () => void;
  post: string | undefined;
}
export function FullScreenImage(props: Props) {
  const { post, close } = props;

  const { CloudinaryUtil } = useCloudinary();

  const postImage = useMemo(() => {
    if (!post) {
      return undefined;
    }
    return CloudinaryUtil.image(post)
      .roundCorners(byRadius(5))
      .format('auto')
      .quality('auto')
      .toURL();
  }, [CloudinaryUtil, post]);

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
                'h-auto overflow-hidden rounded-md bg-white/10 align-middle md:h-full',
                'transform shadow-xl transition-all duration-300',
                'flex flex-col items-stretch justify-center'
              )}
            >
              {!!postImage && (
                <img
                  src={postImage}
                  alt="Post"
                  className="max-h-full object-contain"
                />
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
