import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { format, isToday } from 'date-fns';
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiPencil,
  HiTrash,
} from 'react-icons/hi2';

import Tag from '../../ui/Tag';
import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { formatCurrency } from '../../utils/helpers';
import { formatDistanceFromNow } from '../../utils/helpers';

import { useCheckout } from '../check-in-out/useCheckout';
import { useDeleteBooking } from './useDeleteBooking';
import CreateUpdateBookingForm from './CreateUpdateBookingForm';

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
`;

function BookingRow({ booking }) {
  const {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests,
    rooms,
  } = booking;
  const guestName = guests?.fullName;
  const email = guests?.email; 
  const nationalID = guests?.nationalID;
  const guestId = guests?.id;
  const roomName = rooms?.name; 
  const roomId = rooms?.id;

  console.log({"BookingRow-Rooms": rooms});

  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeletingBooking } = useDeleteBooking();

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <Table.Row>
      <Cabin>{roomName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? 'Today'
            : formatDistanceFromNow(startDate)}{' '}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), 'MMM dd yyyy')} &mdash;{' '}
          {format(new Date(endDate), 'MMM dd yyyy')}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/bookings/${bookingId}`)}
            >
              <span>See details</span>
            </Menus.Button>
            <Modal.Open opens='update'>
              <Menus.Button icon={<HiPencil />}>
                <span>Edit booking</span>
              </Menus.Button>
            </Modal.Open>

            {status === 'unconfirmed' && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/checkin/${bookingId}`)}
              >
                <span>Check in</span>
              </Menus.Button>
            )}

            {status === 'checked-in' && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                onClick={() => {
                  checkout(bookingId);
                }}
                disabled={isCheckingOut}
              >
                <span>Check out</span>
              </Menus.Button>
            )}

            {status === 'unconfirmed' && (
              <Modal.Open opens='delete'>
                <Menus.Button icon={<HiTrash />}>
                  <span>Delete booking</span>
                </Menus.Button>
              </Modal.Open>
            )}
          </Menus.List>
        </Menus.Menu>
        <Modal.Window name='delete'>
          <ConfirmDelete
            resourceName={`Booking #${bookingId}`}
            onConfirm={() => deleteBooking(bookingId)}
            disabled={isDeletingBooking}
          />
        </Modal.Window>
        <Modal.Window name='update'>
          <CreateUpdateBookingForm bookingToEdit={booking} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;