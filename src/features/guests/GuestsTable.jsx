import { useSearchParams } from 'react-router-dom';

import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Pagination from '../../ui/Pagination';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import GuestRow from './GuestRow';
import { useGuests } from './useGuests';

function GuestsTable() {
  const { guests, isLoading, count } = useGuests();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!guests?.length) return <Empty resource='guests' />;

  // 1) FILTER
  const emailFilterValue = searchParams.get('email')?.toLowerCase() || '';
  const nationalIDFilterValue = searchParams.get('nationalID')?.toLowerCase() || '';

  let filteredGuests = [];

  console.log({guests, emailFilterValue, nationalIDFilterValue});

  if (!emailFilterValue && !nationalIDFilterValue) {
    filteredGuests = guests;
  } else if (emailFilterValue && !nationalIDFilterValue) {
    filteredGuests = guests.filter((guest) => guest.email.toLowerCase().indexOf(emailFilterValue) === -1);
  } else if (!emailFilterValue && nationalIDFilterValue) {
    filteredGuests = guests.filter((guest) => guest.nationalID.toLowerCase().indexOf(nationalIDFilterValue) === -1);
  } else if (emailFilterValue && nationalIDFilterValue) {
    filteredGuests = guests.filter((guest) => guest.email.toLowerCase().indexOf(emailFilterValue) === -1 && guest.nationalID.toLowerCase().indexOf(nationalIDFilterValue) === -1);
  }

  return (
    <Menus>
      <Table columns='1.5fr 1fr 0.7fr 1fr 0.3fr 3.2rem'>
        <Table.Header>
          <div>Full Name</div>
          <div>Email</div>
          <div>National ID</div>
          <div>Nationality</div>
          <div>Flag</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={filteredGuests}
          render={(guest) => <GuestRow key={guest.id} guest={guest} />}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default GuestsTable;