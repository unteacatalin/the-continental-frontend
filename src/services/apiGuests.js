import supabase from './supabase';

import { PAGE_SIZE } from '../utils/constants';

export async function getGuestsRowCount({ filter }) {
  let queryCount = supabase.from('guests').select('id', {
    count: 'exact',
    head: true,
  });

  // FILTER
  if (filter) {
    if (filter.nationalID) {
      queryCount = queryCount.ilike('nationalID', `%${filter.nationalID}%`);
    }
    if (filter.email) {
      queryCount = queryCount.ilike('email', `%${filter.email}%`);
    }
  }

  const { error, count: countRows } = await queryCount;

  if (error) {
    console.error(error);
    throw new Error('Guests count could not be loaded');
  }

  return { countRows };
}

export async function getGuests({ filter, sortBy, page }) {
  let query = supabase.from('guests').select('*', { count: 'exact' });

  // FILTER
  if (filter) {
    if (filter.nationalID) {
      query = query.ilike('nationalID', `%${filter.nationalID}%`);
    }
    if (filter.email) {
      query = query.ilike('email', `%${filter.email}%`);
    }
  }

  // SORT
  if (sortBy && sortBy.field) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === 'asc',
    });
  }

  // PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = page * PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error('Guests could not be loaded');
  }

  return { data, count };
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