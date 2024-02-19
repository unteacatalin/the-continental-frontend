import Heading from '../ui/Heading';
import Row from '../ui/Row';
import CabinTable from '../features/cabins/CabinTable';
import AddRoom from '../features/cabins/AddRoom';
import RoomTableOperations from '../features/cabins/RoomTableOperations';

function Rooms() {
  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>All rooms</Heading>
        <AddRoom />
        <RoomTableOperations />
      </Row>
      <Row>
        <CabinTable />
      </Row>
    </>
  );
}

export default Rooms;
