import axios from 'axios';

import { getToday } from '../utils/helpers';
import supabase from '../utils/supabase';
// import { PAGE_SIZE } from '../utils/constants';

export async function getBookings({ filter, sortBy, page }) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let exists = false;
  backendUrl += 'api/v1/bookings';

  console.log({bookingFilter: filter});

  // FILTER
  if (filter) {
    if (exists) {
      backendUrl += '&';
    } else {
      backendUrl += '?';
      exists = true;
    }

    backendUrl += `${filter.field}[${filter.method || 'eq'}]=${filter.value}`;
  }

  // SORT
  if (sortBy && sortBy.field) {
    if (exists) {
      backendUrl += '&';
    } else {
      backendUrl += '?';
      exists = true;
    }

    backendUrl += `sort=${sortBy.field}${sortBy.direction === 'desc' ? '-' : '+'}`;
  }

  // PAGINATION
  if (page) {
    if (exists) {
      backendUrl += '&';
    } else {
      backendUrl += '?';
      exists = true;
    }

    backendUrl += `page=${page}`;
  }

  console.log({backendUrl}); 

  const { data, error}  = await axios.get(
    backendUrl,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (error) {
    console.error(error);
    throw new Error('Rooms data could not be loaded');
  }

  console.log({getGuests: data});

  const bookings = data?.data?.bookings || [];
  const count = data?.data?.count;
  const from = data?.data?.from;
  const to = data?.data?.to;
  const PAGE_SIZE = data?.data?.pageSize;

  return {data: bookings, count, from, to, PAGE_SIZE, error};  
}

export async function getBooking(id) {
  let backendUrl;
  let error = '';

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  backendUrl += 'api/v1/bookings';

  if (!id) {
    error = 'Missing booking id'
    return { data: {}, error }
  }

  backendUrl = `${backendUrl}/${id}`;

  const { data, error: fetchError } = await axios.get(
    backendUrl,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    }
  );

  if (fetchError) {
    console.error(fetchError);
    throw new Error('Booking not found');
  }

  const booking = data?.data?.booking;

  console.log({getBookingAPI: booking});

  return {data: booking, error};
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date: ISOString
export async function getBookingsAfterDate(date) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  backendUrl += 'api/v1/bookings/after-date';

  let error = '';

  if (!date) {
    error = "Missing booking's after date";
    console.error(error);
    throw new Error(error);
  } else {
    backendUrl = `${backendUrl}/${date}`;
  }

  console.log({getBookingsAfterDateURL: backendUrl});

  const { data, error: errorBookingsAfterDate } = await axios.get(
    backendUrl,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (errorBookingsAfterDate) {
    console.error(errorBookingsAfterDate);
    throw new Error('Bookings could not get loaded');
  }

  console.log({getBookingsAfterDateDATA: data});

  const bookings = data?.data?.bookings || [];

  return { data: bookings, error };
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  backendUrl += 'api/v1/bookings/stays-after-date';

  let error = '';

  if (!date) {
    error = "Missing stay's after date";
    console.error(error);
    throw new Error(error);
  } else {
    backendUrl = `${backendUrl}/${date}`;
  }

  console.log({getStaysAfterDateURL: backendUrl});

  const { data, error: errorStaysAfterDate } = await axios.get(
    backendUrl,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (errorStaysAfterDate) {
    console.error(errorStaysAfterDate);
    throw new Error('Bookings could not get loaded');
  }

  console.log({getStaysAfterDateDATA: data});

  const bookings = data?.data?.bookings || [];

  return { data: bookings, error };
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, numNights, status, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order('created_at');

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data;
}

// Available rooms between start date and end date
export async function getBookedRoomsInInterval(startDate, endDate, bookingId) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let exists = false;
  backendUrl += 'api/v1/bookings/booked-rooms-in-interval';

  if (startDate) {
    if (exists) {
      backendUrl += '&';
    } else {
      backendUrl += '?';
    }
    exists = true;
    backendUrl += `startDate=${startDate}`;
  }

  if (endDate) {
    if (exists) {
      backendUrl += '&';
    } else {
      backendUrl += '?';
    }
    exists = true;
    backendUrl += `endDate=${endDate}`;
  }

  if (bookingId) {
    if (exists) {
      backendUrl += '&';
    } else {
      backendUrl += '?';
    }
    exists = true;
    backendUrl += `bookingId=${bookingId}`;
  }

  let { data, error } = await axios.get(
    backendUrl,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (error) {
    console.error(error);
    throw new Error('Booked rooms could not be retrieved');
  }

  const rooms = data?.data?.rooms;
  console.log({BookedRoomsInIntervalAPI: rooms, backendUrl});

  return { rooms, error };
}

export async function createUpdateBooking(obj, id) {
  // // 1. Create/update guest
  // let query = supabase.from('bookings');

  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let reqUrl = `${backendUrl}api/v1/bookings`;
  let method = 'POST';

  if (id) {
    reqUrl += `/${id}`;
    method = 'PATCH';
  }
  
  console.log({ obj });
  
  const {
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    roomPrice,
    extrasPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    observations,
    roomId,
    guestId,
    // rooms: { id: roomId },
    // guests: { id: guestId },
  } = obj;
  const validCreateAt = !isNaN(new Date(created_at)) ? new Date(created_at).toISOString() : undefined;
  const validStartDate = !isNaN(new Date(startDate)) ? new Date(startDate).toISOString() : undefined;
  const validEndDate = !isNaN(new Date(endDate)) ? new Date(endDate).toISOString() : undefined;
  const newBooking = {
    created_at: validCreateAt,
    startDate: validStartDate,
    endDate: validEndDate,
    numNights,
    numGuests,
    roomPrice,
    extrasPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    observations,
    roomId,
    guestId,
  };

  // if (!id) {
  //   // A) CREATE
  //   query = query.insert([newBooking]);
  // } else {
  //   // B) EDIT
  //   query = query.update(newBooking).eq('id', id);
  // }

  // const { data, error } = await query.select().single();

  // if (error) {
  //   console.error(error);
  //   throw new Error('Booking could not be updated');
  // }
  // return data;


  const { data, error: errorSavingData } = await axios({
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: reqUrl,
    data: JSON.stringify(newBooking),
    withCredentials: true
  });
  console.log({createUpdateBooking: data});

  let error;

  if (errorSavingData) {
    console.error(errorSavingData);
    error = 'Guest could not be created/edited';
    throw new Error(error);
  }

  const booking = data?.data?.booking;

  return {data: booking, error};
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}