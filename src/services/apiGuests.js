import axios from 'axios';
// import supabase from '../utils/supabase';

import { PAGE_SIZE } from '../utils/constants';

export async function getGuestsRowCount({ filter }) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let exists = false;
  backendUrl += 'api/v1/guests/count';

  // FILTER
  if (filter) {
    if (filter.nationalID) {
      backendUrl += `?nationalID=${filter.nationalID}`;
      exists = true;
    }
    if (filter.email) {
      if (exists) {
        backendUrl += '&';
      } else {
        backendUrl += '?';
        exists = true;
      }
      backendUrl += `email=${filter.email}`;
    }
  }

  const { data, error } = await axios.get(backendUrl,{
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });

  if (error) {
    console.error(error);
    throw new Error('Guests count could not be loaded');
  }

  const count = data?.data?.count;

  return { data: count, error }
}

// export async function getGuests({ filter, sortBy, page }) {
  // let query = supabase.from('guests').select('*', { count: 'exact' });

  // // FILTER
  // if (filter) {
  //   if (filter.nationalID) {
  //     query = query.ilike('nationalID', `%${filter.nationalID}%`);
  //   }
  //   if (filter.email) {
  //     query = query.ilike('email', `%${filter.email}%`);
  //   }
  // }

  // // SORT
  // if (sortBy && sortBy.field) {
  //   query = query.order(sortBy.field, {
  //     ascending: sortBy.direction === 'asc',
  //   });
  // }

  // // PAGINATION
  // if (page) {
  //   const from = (page - 1) * PAGE_SIZE;
  //   const to = page * PAGE_SIZE - 1;

  //   query = query.range(from, to);
  // }

  // const { data, error, count } = await query;

  // if (error) {
  //   console.error(error);
  //   throw new Error('Guests could not be loaded');
  // }

  // return { data, count };

export async function getGuests({ filter, sortBy, page }) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let exists = false;
  // let updPage = page;
  backendUrl += 'api/v1/guests';

  console.log({filter});

  // FILTER
  if (filter) {
    if (filter.nationalID) {
      backendUrl += `?nationalID[ilike]=${filter.nationalID}`;
      exists = true;
      // updPage = 1;
    }
    if (filter.email) {
      if (exists) {
        backendUrl += '&';
      } else {
        backendUrl += '?';
        exists = true;
        // updPage = 1;
      }
      backendUrl += `email[ilike]=${filter.email}`;
    }
  }

  // // SORT
  // if (sortBy && sortBy.field) {
  //   if (exists) {
  //     backendUrl += '&';
  //   } else {
  //     backendUrl += '?';
  //     exists = true;
  //   }

  //   backendUrl += `sort=${sortBy.field}${sortBy.direction === 'desc' ? '-' : '+'}`;
  // }

  // // PAGINATION
  // if (page) {
  //   if (exists) {
  //     backendUrl += '&';
  //   } else {
  //     backendUrl += '?';
  //     exists = true;
  //   }

  //   const from = (updPage - 1) * PAGE_SIZE;
  //   const to = updPage * PAGE_SIZE - 1;

  //   backendUrl += `from=${from}&to=${to}`;
  // }  

  console.log({backendUrl});

  const { data, error } = await axios.get(backendUrl,{
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });

  if (error) {
    console.error(error);
    throw new Error('Guests data could not be loaded');
  }

  const guests = data?.data?.guests;
  const count = data?.data?.count;

  console.log({getGuests: data});

  return { data: guests, count, error }
}

export async function createEditGuest(newGuest) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const id = newGuest.id;
  const countryFlag = newGuest.countryFlag;
  const nationality = newGuest.nationality;
  const nationalID = newGuest.nationalID;
  const email = newGuest.email;

  let reqUrl = `${backendUrl}api/v1/guests`;
  let method = 'POST';

  if (id) {
    reqUrl += `/${id}`;
    method = 'PATCH';
  }

  const { data, error: errorSavingData } = await axios({
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: reqUrl,
    data: JSON.stringify({ ...newGuest, countryFlag, nationality, nationalID, email }),
    withCredentials: true
  });

  let error;

  if (errorSavingData) {
    console.error(errorSavingData);
    error = 'Guest could not be created/edited';
    throw new Error(error);
  }

  const guest = data?.data?.guest;

  return {data: guest, error};
}

export async function deleteGuest(id) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const { data, error } = await axios.delete(
    `${backendUrl}api/v1/guests/${id}`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
      }
    }
  );

  if (error) {
    console.error(error);
    throw new Error('Guest data could not be deleted');
  }

  const guest = data?.data?.guest;

  return { data: guest, error };
}