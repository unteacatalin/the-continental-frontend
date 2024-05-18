import { useQuery } from '@tanstack/react-query';
import { getStaysTodayActivity } from '../../services/apiBookings';

export function useTodayActivity() {
  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ['today-activity'],
  });

  if (error) throw new Error("Unable to fetch today's activity");

  const activities = data?.stays;

  return { isLoading, activities };
}