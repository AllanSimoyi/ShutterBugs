import { Menu, Transition } from '@headlessui/react';
import { Form } from '@remix-run/react';
import { Fragment, useMemo } from 'react';
import { DotsVertical } from 'tabler-icons-react';

import { AppLinks } from '~/lib/links';

import { ToolbarMenuItem } from './ToolbarMenuItem';

interface Props {
  loggedIn: boolean;
}
export function DropDownMenu(props: Props) {
  const { loggedIn } = props;

  const menuItems: [string, string][] = useMemo(() => {
    if (!loggedIn) {
      return [
        [AppLinks.Login, 'Log In'],
        [AppLinks.Join, 'Create Account'],
      ];
    }
    return [
      [AppLinks.Profile, 'Profile'],
      [AppLinks.NewPost, 'Upload'],
    ];
  }, [loggedIn]);

  const children = useMemo(() => {
    const itemChildren = menuItems.map(([link, caption]) => {
      return function child(active: boolean) {
        return (
          <ToolbarMenuItem mode="link" active={active} to={link}>
            {caption}
          </ToolbarMenuItem>
        );
      };
    });
    if (!loggedIn) {
      return itemChildren;
    }
    return [
      ...itemChildren,
      function child(active: boolean) {
        return (
          <Form action={AppLinks.Logout} method="post">
            <ToolbarMenuItem mode="button" active={active} type="submit">
              Log Out
            </ToolbarMenuItem>
          </Form>
        );
      },
    ];
  }, [loggedIn, menuItems]);

  return (
    <>
      <div className="relative">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              type="button"
              className="rounded p-2 transition-all duration-300 hover:bg-stone-100"
            >
              <DotsVertical data-testid="menu" size={20} />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                {children.map((child, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => child(active)}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
}
