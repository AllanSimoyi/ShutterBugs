import useDebounce from './useDebounce';

export function useDebouncedSearch(runSearch: (searchTerms: string) => void) {
  return useDebounce((searchTerms: string) => {
    runSearch(searchTerms);
  }, 800);
}
