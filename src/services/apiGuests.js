import axios from 'axios';

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
      backendUrl += `?nationalID[ilike]=${filter.nationalID}`;
      exists = true;
    }
    if (filter.email) {
      if (exists) {
        backendUrl += '&';
      } else {
        backendUrl += '?';
        exists = true;
      }
      backendUrl += `email[ilike]=${filter.email}`;
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

    backendUrl += `page=${page}`;
  }  

  const { data, error } = await axios.get(
    backendUrl,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  );

  if (error) {
    console.error(error);
    throw new Error('Guests data could not be loaded');
  }

  const guests = data?.data?.guests;
  const count = data?.data?.count;
  const from = data?.data?.from;
  const to = data?.data?.to;
  const PAGE_SIZE = data?.data?.pageSize;

  return { data: guests, count, from, to, PAGE_SIZE, error }
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

export async function getAllGuests({ sortBy }) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let exists = false;
  backendUrl += 'api/v1/guests/all';

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

  const { data, error } = await axios.get(
    backendUrl,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  );

  if (error) {
    console.error(error);
    throw new Error('All guests could not be retrieved');
  }

  const guests = data?.data?.guests;
  const count = data?.data?.count;

  return { data: guests, count, error }
}