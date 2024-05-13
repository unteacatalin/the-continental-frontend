import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getBooking } from '../../services/apiBookings';

export function useBooking() {
  const { bookingId } = useParams();

  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  const booking = data?.data?.booking;

  console.log({'useBooking': booking});

  return { isLoading, booking, error };
}