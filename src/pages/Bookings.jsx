import { useEffect } from 'react';

import Heading from '../ui/Heading';
import Row from '../ui/Row';
import BookingTable from '../features/bookings/BookingTable';
import BookingTableOperations from '../features/bookings/BookingTableOperations';
import { PAGE_SIZE } from '../utils/constants';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBookingsRowCount } from '../services/apiBookings';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import AddBooking from '../features/bookings/AddBooking';

function Bookings() {
  const [searchParams, setSearchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get('status');
  const filter =
    !filterValue || filterValue === 'all'
      ? null
      : { field: 'status', value: filterValue, method: 'eq' };

  // PAGINATION
  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  const { data: { countRows } = {}, isFetching } = useQuery({
    queryKey: ['bookingsCount', filter],
    queryFn: async () => await getBookingsRowCount({ filter }),
  });

  useEffect(
    function () {
      if (countRows && Math.ceil(countRows / PAGE_SIZE) < page && page > 1) {
        searchParams.set('page', page - 1);
        setSearchParams(searchParams);
      }
    },
    [countRows]
  );

  if (isFetching) return <Spinner />;

  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>All bookings</Heading>
        <AddBooking />
        <BookingTableOperations />
      </Row>

      <BookingTable />
    </>
  );
}

export default Bookings;
