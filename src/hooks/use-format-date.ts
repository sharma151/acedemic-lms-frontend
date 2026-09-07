import { useCallback } from 'react';
import dayjs from 'dayjs';
import { DATE_FORMATS, DateFormat } from '@/configs/constants';

export function useFormatDate() {
  const formatDate = useCallback((date: string | Date | number | null | undefined, format: DateFormat = 'DEFAULT') => {
    if (!date) return '-';
    
    const parsedDate = dayjs(date);
    
    if (!parsedDate.isValid()) {
      return '-';
    }

    return parsedDate.format(DATE_FORMATS[format]);
  }, []);

  return { formatDate };
}
