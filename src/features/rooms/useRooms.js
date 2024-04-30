import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getRooms } from '../../services/apiRooms';

export function useRooms() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterDiscount = searchParams.get('discount');
  let filter = {};
  if (filterDiscount) {
    filter = { ...filter, discount: filterDiscount };
  }

  // SORT
  const sortByRaw = searchParams.get('sortBy') || 'fullName-asc';
  const [field, direction] = sortByRaw.split('-');
  const sortBy = { field, direction };

  // PAGINATION
  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  // QUERY
  const {
    isLoading,
    data: rooms, count, from, to, PAGE_SIZE,
    error,
  } = useQuery({
    queryKey: ['rooms', filter, sortBy, page],
    queryFn: () => getRooms({ filter, sortBy, page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);  

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ['rooms', filter, sortBy, page + 1],
      queryFn: () =>
        getRooms({
          filter,
          sortBy,
          page: page + 1,
        }),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ['rooms', filter, sortBy, page - 1],
      queryFn: () =>
        getRooms({
          filter,
          sortBy,
          page: page - 1,
        }),
    });
  }

  return { isLoading, rooms, count, from, to, PAGE_SIZE, error };
}