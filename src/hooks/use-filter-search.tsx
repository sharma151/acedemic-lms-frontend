import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { DEBOUNCE_DELAY } from '@/configs/constants';
import { cn } from '@/lib/utils'; // Assuming cn is exported from lib/utils, as standard in shadcn/ui

type Props = {
  id: string;
  placeholder?: string;
  type?: 'text' | 'number';
  className?: string;
  searchIcon?: React.JSX.Element;
  onSearchChange?: (value?: string) => void;
  initialValue?: string;
};

/**
 * List-page search box. `debouncedSearch` updates after delay; clearing the
 * input (or setSearchInput('')) commits empty immediately so Clear-all cannot
 * be overwritten by a pending debounce.
 */
const useFilterSearch = ({
  id,
  placeholder,
  type,
  className,
  searchIcon,
  onSearchChange,
  initialValue,
}: Props) => {
  const [searchInput, setSearchInputState] = useState(initialValue ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onSearchChangeRef = useRef(onSearchChange);
  
  // Keep the ref updated with the latest callback
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const setSearchInput = useCallback((next: string) => {
    setSearchInputState(next);
    clearTimeout(timerRef.current);

    if (next === '') {
      setDebouncedSearch('');
      return;
    }

    timerRef.current = setTimeout(() => {
      setDebouncedSearch(next);
    }, DEBOUNCE_DELAY);
  }, []);

  const renderSearch = useCallback(() => {
    return (
      <div className="relative w-full">
        {searchIcon ? (
          searchIcon
        ) : (
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        )}
        <Input
          id={id}
          type={type ?? 'text'}
          placeholder={placeholder ?? 'Search...'}
          className={cn('pl-9 bg-white', className)}
          value={searchInput}
          maxLength={255}
          onChange={(e) => {
            const next = e.target.value;
            setSearchInput(next);
            onSearchChangeRef.current?.(next);
          }}
        />
      </div>
    );
  }, [
    className,
    id,
    placeholder,
    searchIcon,
    searchInput,
    setSearchInput,
    type,
  ]);

  return {
    renderSearch,
    debouncedSearch,
    setSearchInput,
  };
};

export default useFilterSearch;
