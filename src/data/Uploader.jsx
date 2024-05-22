import { useState } from 'react';
import axios from 'axios';

import Button from '../ui/Button';

async function deleteGuests() {
  const { error } = await axios.delete(
    `${backendUrl}api/v1/guests`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (error) console.log(error.message);
}

async function deleteRooms() {
  const { error } = await axios.delete(
    `${backendUrl}api/v1/rooms`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );  
  
  if (error) console.log(error.message);
}

async function deleteBookings() {
  const { error } = await axios.delete(
    `${backendUrl}api/v1/bookings`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (error) console.log(error);
}

async function createGuests() {
  const { guests, error } = await axios.post(
    `${backendUrl}api/v1/guests`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (error) console.error(error);
  else console.log(guests);
}

async function createRooms() {
  const { rooms, error } = await axios.post(
    `${backendUrl}api/v1/rooms`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (error) console.error(error);
  else console.log(rooms);
}

async function createBookings() {
  const { bookings, error } = await axios.post(
    `${backendUrl}api/v1/bookings`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (error) console.error(error);
  else console.log(bookings);
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    // Bookings need to be deleted FIRST
    await deleteBookings();
    await deleteGuests();
    await deleteRooms();

    // Bookings need to be created LAST
    await createGuests();
    await createRooms();
    await createBookings();

    setIsLoading(false);
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: 'auto',
        backgroundColor: '#e0e7ff',
        padding: '8px',
        borderRadius: '5px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;