import { Link } from '@remix-run/react';

import { AppLinks } from '~/lib/links';

import { AppTitle } from './AppTitle';
import { CenteredView } from './CenteredView';
import { DebouncedSearch } from './DebouncedSearch';
import { DropDownMenu } from './DropDownMenu';
import { UnderLineOnHover } from './UnderLineOnHover';

export interface ToolbarProps {
  currentUserName: string | undefined;
  hideSearch?: boolean;
}

export function Toolbar(props: ToolbarProps) {
  const { currentUserName, hideSearch } = props;

  return (
    <header className="sticky top-0 z-10 flex w-full flex-col items-stretch border border-stone-200 bg-white/80 backdrop-blur-lg">
      <CenteredView>
        <div className="grid grid-cols-2 gap-2 p-2 lg:grid-cols-3">
          <div className="order-1 flex flex-col items-start justify-center">
            <Link
              to={AppLinks.Home}
              className="flex flex-row items-center gap-4"
            >
              <AppTitle isIcon />
              <UnderLineOnHover>
                <h1 className="text-lg font-normal text-stone-400 transition-all duration-150 hover:text-stone-600">
                  ShutterBugs
                </h1>
              </UnderLineOnHover>
            </Link>
            <div className="grow" />
          </div>
          {!hideSearch && (
            <div className="order-3 col-span-2 flex flex-col items-stretch lg:order-2 lg:col-span-1">
              <DebouncedSearch runSearch={() => {}} placeholder="Search" />
            </div>
          )}
          {hideSearch && <div className="order-3 grow lg:order-2" />}
          <div className="order-2 flex flex-row items-center justify-end gap-4 lg:order-3">
            {currentUserName && (
              <span
                className="hidden p-2 text-base font-light md:flex"
                title={currentUserName}
              >
                {currentUserName}
              </span>
            )}
            <DropDownMenu loggedIn={!!currentUserName} />
          </div>
        </div>
      </CenteredView>
    </header>
  );
}
