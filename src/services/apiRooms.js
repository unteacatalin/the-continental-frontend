import supabase from '../utils/supabase';
import { supabaseUrl } from '../utils/supabase';
import APIFeatures from '../utils/apiFeatures';
import axios from 'axios';

export const getRooms = async function () {
  // const features = new APIFeatures(supabase.from('rooms'), req.query)
  //   .limitFields()
  //   .filter()
  //   .sort()
  //   .paginate();
  // // EXECUTE QUERY
  // const { data: rooms, error } = await features.query;

  // if (error) {
  //   console.error(error);
  // }

  // return { data: rooms, error };

  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const { data, error}  = await axios.get(
    `${backendUrl}api/v1/rooms`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        // 'Content-Type': 'application/json'
    }
    }
  );

  console.log({rooms: data});

  if (error) {
    console.error(error);
    throw new Error('Rooms data could not be loaded');
  }

  const rooms = data?.data?.rooms;

  // return result.rooms;
  return {data: rooms, error};  
};

export const deleteRoom = async function (id) {
  // const { error } = await supabase.from('rooms').delete().eq('id', id);

  // if (error) {
  //   console.error(error);
  // }

  // return { data: { room: {} }, error };

  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const { data, error}  = await axios.delete(
    `${backendUrl}api/v1/rooms/${id}`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        // 'Content-Type': 'application/json'
    }
    }
  );

  if (error) {
    console.error(error);
    throw new Error('Rooms data could not be loaded');
  }

  const rooms = data?.data?.rooms;

  // return result.rooms;
  return {data: rooms, error};   
};

export const createEditRoom = async function ({ newRoom, id }) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let reqUrl = `${backendUrl}api/v1/rooms`;

  if (id) {
    reqUrl += `/${id}`;
  }

  const { data, error}  = await axios({
    method: 'PATCH',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: reqUrl,
    data: JSON.stringify({
      newRoom,
      id
    }),
    withCredentials: true,
  });

  if (error) {
    console.error(error);
    throw new Error('Room cound not be saved!');
  }

  const room = data?.data?.rooms;

  // return result.rooms;
  return {data: room, error};  
};
