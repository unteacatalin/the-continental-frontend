import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Row from '../ui/Row';
import Heading from '../ui/Heading';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { getGuestsRowCount } from '../services/apiGuests';
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

  // PAGINATION
  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  const { data, isFetching } = useQuery({
    queryKey: ['guestsCount', filter],
    queryFn: async () => await getGuestsRowCount({ filter }),
  });

  const countRows = data?.data?.count;
  const pageSize = data?.data?.pageSize;

  console.log({countGuests: countRows, pageSizeGuests: pageSize, data});

  useEffect(
    function () {
      if (countRows && pageSize && Math.ceil(countRows / pageSize) < page && page > 1) {
        searchParams.set('page', page - 1);
        setSearchParams(searchParams);
      }
    },
    [countRows]
  );

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

  if (isFetching) return <Spinner />;

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