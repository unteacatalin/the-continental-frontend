import { useQuery } from '@tanstack/react-query';

import { getAllRooms as getAllRoomsApi } from '../../services/apiRooms';

export function useAllRooms() {
  // SORT
  const sortByRaw = 'name-asc';
  const [field, direction] = sortByRaw.split('-');
  const sortBy = { field, direction };

  // QUERY
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getAllRoomsApi({ sortBy }),
    queryKey: ['allRooms'],
  });

  const rooms = data?.data;

  return { isLoading, rooms, error };
}