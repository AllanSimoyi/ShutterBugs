import { Link } from '@remix-run/react';

import { PRODUCT_NAME } from '~/lib/constants';
import { AppLinks } from '~/lib/links';

import { AppTitle } from './AppTitle';
import { CenteredView } from './CenteredView';
import { DebouncedSearch } from './DebouncedSearch';
import { DropDownMenu } from './DropDownMenu';

export interface ToolbarProps {
  currentUserName: string | undefined;
}

export function Toolbar(props: ToolbarProps) {
  const { currentUserName } = props;

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-stretch border border-stone-200 bg-white/80 backdrop-blur-lg">
      <CenteredView>
        <div className="flex flex-col items-stretch gap-2 p-2 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex flex-row items-center lg:w-[20%]">
            <Link to={AppLinks.Home}>
              <AppTitle title={PRODUCT_NAME} />
            </Link>
            <div className="grow" />
            <div className="flex flex-row items-end gap-4 lg:hidden">
              {/* <ToggleColorMode aria-label="Toggle Dark Mode" /> */}
              <DropDownMenu loggedIn={!!currentUserName} />
            </div>
          </div>
          <div className="grow" />
          <div className="flex grow flex-row items-center justify-center rounded-md md:min-w-[60%] lg:min-w-[40%]">
            <DebouncedSearch runSearch={() => {}} placeholder="Search" />
          </div>
          <div className="hidden grow lg:flex" />
          <div className="hidden flex-row items-center justify-end gap-2 lg:flex lg:w-1/5">
            {currentUserName && (
              <span className="p-2 text-sm" title={currentUserName}>
                {currentUserName}
              </span>
            )}
            {/* <ToggleColorMode aria-label="Toggle Dark Mode" /> */}
            <DropDownMenu loggedIn={!!currentUserName} />
          </div>
        </div>
      </CenteredView>
    </header>
  );
}
