import { useCallback, useEffect } from 'react';

import useDebounce from '../hooks/useDebounce';

import { SearchBox } from './SearchBox';

export function DebouncedSearch({
  runSearch,
  toggleInput = undefined,
  ...restOfProps
}: {
  runSearch: (searchTerms: string) => void;
  toggleInput?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { searchTerms, setSearchTerms } = useDebounce((searchTerms: string) => {
    runSearch(searchTerms);
  }, 800);

  const handleTermChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerms(event.target.value);
    },
    [setSearchTerms]
  );

  useEffect(() => {
    if (toggleInput !== undefined) {
      setSearchTerms('');
    }
  }, [setSearchTerms, toggleInput]);

  return (
    <SearchBox
      name="search"
      placeholder="Search"
      value={searchTerms}
      onChange={handleTermChange}
      {...restOfProps}
    />
  );
}
