import { useEffect, useCallback, useState } from 'react';

export default function useDebounce(
  effect: (searchTerms: string) => void,
  delay: number
) {
  const [searchTerms, setSearchTerms] = useState('');
  const [oldSearchTerms, setOldSearchTerms] = useState('');

  const callback = useCallback(() => {
    return effect(searchTerms);
  }, [searchTerms, effect]);

  useEffect(() => {
    if (searchTerms !== oldSearchTerms) {
      const timeout = setTimeout(() => {
        callback();
        setOldSearchTerms(searchTerms);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [searchTerms, oldSearchTerms, callback, delay]);

  return { searchTerms, setSearchTerms };
}
