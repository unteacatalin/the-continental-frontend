import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';
import { useRooms } from './useRooms';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
// import { useSearchParams } from 'react-router-dom';
import Empty from '../../ui/Empty';
import Pagination from '../../ui/Pagination';

function CabinTable() {
  const { isLoading, rooms, count, PAGE_SIZE, error } = useRooms();
  // const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  
  if (!rooms?.length) return <Empty resource='rooms' />;

  // // 1) FILTER
  // const filterValue = searchParams.get('discount') || 'all';

  // let filteredRooms = [];
  // if (filterValue === 'all') filteredRooms = rooms.data;
  // if (filterValue === 'no-discount')
  //   filteredRooms = rooms.data.filter((room) => room.discount === 0);
  // if (filterValue === 'with-discount')
  //   filteredRooms = rooms.data.filter((room) => room.discount > 0);

  // // 2) SORT
  // const sortBy = searchParams.get('sortBy') || 'name-asc';

  // const [field, direction] = sortBy.split('-');
  // const modifier = direction === 'asc' ? 1 : -1;
  // function compareText(a, b) {
  //   if (a[field].toLowerCase() < b[field].toLowerCase()) {
  //     return -1 * modifier;
  //   }
  //   if (a[field].toLowerCase() > b[field].toLowerCase()) {
  //     return 1 * modifier;
  //   }
  //   return 0;
  // }
  // function compareNumbers(a, b) {
  //   return (a[field] - b[field]) * modifier;
  // }
  // const sortedRooms =
  //   typeof rooms.data[0][field] === 'number'
  //     ? filteredRooms.sort(compareNumbers)
  //     : filteredRooms.sort(compareText);

  return (
    <Menus>
      <Table columns='1fr 1.8fr 2.2fr 1fr 1fr 1fr'>
        <Table.Header>
          <div></div>
          <div>Room</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={rooms}
          render={(room) => <CabinRow room={room} key={room.id} />}
        />
        <Table.Footer>
          <Pagination count={count} pageSize={PAGE_SIZE} />
        </Table.Footer>        
      </Table>
    </Menus>
  );
}

export default CabinTable;