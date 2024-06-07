import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Row from '../ui/Row';
import Heading from '../ui/Heading';
import Button from '../ui/Button';
import GuestsTableOperations from '../features/guests/GuestsTableOperations';
import GuestsTable from '../features/guests/GuestsTable';
import CreateGuestForm from '../features/guests/CreateGuestForm';
import Modal from '../ui/Modal';

function Guests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState(
    searchParams.get('email') || ''
  );
  const [nationalID, setNationalID] = useState(
    searchParams.get('nationalID') || ''
  );

  let filter = { email, nationalID };

  useEffect(
    function () {
      if (searchParams.get('email')) {
        filter = { ...filter, email };
        setEmail(searchParams.get('email'));
      } else {
        filter = { ...filter, email: undefined };
        setEmail(searchParams.get('email'));
      }

      if (searchParams.get('nationalID')) {
        filter = { ...filter, nationalID };
        setNationalID(searchParams.get('nationalID'));
      } else {
        filter = { ...filter, nationalID: undefined };
        setNationalID(searchParams.get('nationalID'));
      }
    },
    [searchParams.get('email'), searchParams.get('nationalID')]
  );

  return (
    <>
      <Modal>
        <Row type='horizontal'>
          <Heading as='h1'>All guests</Heading>
          <Modal.Open opens='create'>
            <Button size='medium' variation='secondary'>
              Add guest
            </Button>
          </Modal.Open>
          <Modal.Window name='create'>
            <CreateGuestForm />
          </Modal.Window>
          <GuestsTableOperations />
        </Row>
        <GuestsTable />
      </Modal>
    </>
  );
}

export default Guests;