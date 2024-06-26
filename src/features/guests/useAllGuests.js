import { useQuery } from '@tanstack/react-query';

import { getAllGuests as getAllGuestsApi } from '../../services/apiGuests';

export function useAllGuests() {
  // SORT
  const sortByRaw = 'fullName-asc';
  const [field, direction] = sortByRaw.split('-');
  const sortBy = { field, direction };

  // QUERY
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getAllGuestsApi({ sortBy }),
    queryKey: ['allGuests'],
  });

  const guests = data?.data;

  return { isLoading, guests, error };
}