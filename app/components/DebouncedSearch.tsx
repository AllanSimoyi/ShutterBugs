import { useCallback, useEffect } from 'react';

import useDebounce from '../hooks/useDebounce';

import { SearchBox } from './SearchBox';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  runSearch: (searchTerms: string) => void;
  toggleInput?: boolean;
}

export function DebouncedSearch(props: Props) {
  const { runSearch, toggleInput = undefined, ...restOfProps } = props;

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
