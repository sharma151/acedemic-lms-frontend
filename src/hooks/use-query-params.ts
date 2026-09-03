"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook to get, set, and remove a single query parameter
 * Adapted for Next.js App Router.
 */
export const useQueryParam = (key: string) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get current value
  const value = searchParams.get(key);

  // Helper to create a new query string safely
  const createQueryString = useCallback(
    (name: string, val: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, val);
      return params.toString();
    },
    [searchParams]
  );

  // Set or update value (keeps other params)
  const setValue = useCallback(
    (val: string) => {
      router.replace(`${pathname}?${createQueryString(key, val)}`, {
        scroll: false,
      });
    },
    [pathname, router, createQueryString, key]
  );

  // Remove this param
  const remove = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const newQueryString = params.toString();
    router.replace(
      newQueryString ? `${pathname}?${newQueryString}` : pathname,
      { scroll: false }
    );
  }, [key, pathname, router, searchParams]);

  // Set multiple query params at once
  const setQueryParams = useCallback(
    (paramsToUpdate: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(paramsToUpdate).forEach(([k, v]) => {
        if (v === null || v === undefined) {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      });

      const newQueryString = params.toString();
      router.replace(
        newQueryString ? `${pathname}?${newQueryString}` : pathname,
        { scroll: false }
      );
    },
    [pathname, router, searchParams]
  );

  return { value, setValue, remove, setQueryParams };
};
