import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';

export function useSettings() {
  const {
    isLoading,
    settings,
    error,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  console.log({settings});

  return { isLoading, settings, error };
}