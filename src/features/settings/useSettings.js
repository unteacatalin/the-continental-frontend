import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';

export function useSettings() {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const settings = data?.settings;

  return { isLoading, settings, error };
}