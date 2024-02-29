import Heading from '../ui/Heading';
import Row from '../ui/Row';
import CabinTable from '../features/rooms/CabinTable';
import AddRoom from '../features/rooms/AddRoom';
import RoomTableOperations from '../features/rooms/RoomTableOperations';

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