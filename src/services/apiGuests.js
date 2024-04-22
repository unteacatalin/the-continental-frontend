import axios from 'axios';
import supabase from '../utils/supabase';

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

  console.log({backendUrl});

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
  backendUrl += 'api/v1/guests';

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

    const from = (page - 1) * PAGE_SIZE;
    const to = page * PAGE_SIZE - 1;

    backendUrl += `from=${from}&to=${to}`;
  }  

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

  return { data: guests, error }
}

export async function createEditGuest(newGuest, countryFlag, nationality, id) {
  // 1. Create/edit guest
  let query = supabase.from('guests');

  if (!id) {
    // A) CREATE
    query = query.insert([{ ...newGuest, countryFlag, nationality }]);
  } else {
    // B) EDIT
    query = query
      .update({ ...newGuest, countryFlag, nationality })
      .eq('id', id);
  }

  const { data: guest, error } = await query.select();

  if (error) {
    console.error(error);
    throw new Error('Guest could not be created/edited');
  }

  return guest;
}

export async function deleteGuest(id) {
  const { error } = await supabase.from('guests').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Guest data could not be deleted');
  }

  return {};
}