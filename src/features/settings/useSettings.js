import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';

export function useSettings() {
  const {
    isLoading,
    error,
    data,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  console.log({data});

  const settings = data?.settings;

  return { isLoading, error, settings };
}