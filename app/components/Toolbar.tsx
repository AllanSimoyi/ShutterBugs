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
    <header className="sticky top-0 flex w-full flex-col items-stretch border border-stone-200 bg-white/80 backdrop-blur-lg">
      <CenteredView>
        <div className="grid grid-cols-2 gap-2 p-2 lg:grid-cols-3">
          <div className="order-1 flex flex-col justify-center">
            <Link to={AppLinks.Home}>
              <AppTitle title={PRODUCT_NAME} />
            </Link>
          </div>
          <div className="order-3 col-span-2 flex flex-col items-stretch lg:order-2 lg:col-span-1">
            <DebouncedSearch runSearch={() => {}} placeholder="Search" />
          </div>
          <div className="order-2 flex flex-row items-center justify-end gap-2 lg:order-3">
            {currentUserName && (
              <span className="p-2 text-sm font-light" title={currentUserName}>
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
