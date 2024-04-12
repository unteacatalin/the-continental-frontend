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

export const createEditRoom = async function (newRoom) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const image = newRoom?.formData;
  console.log({"createEditRoom-formData": image});
  let error, imageName;

  if (image) {
    const {data, error: errorUploadingFile} = await uploadImage(image);
    if (errorUploadingFile) {
      error = errorUploadingFile;
      throw new Error(error);
    } else {
      imageName = data?.imageName;
    }
  }

  const id = newRoom?.id;
  const imageUrl = newRoom?.image;
  let reqUrl = `${backendUrl}api/v1/rooms`;
  let method = 'POST';

  if (id) {
    reqUrl += `/${id}`;
    method = 'PATCH'
  }

  const { data, error: errorSavingData}  = await axios({
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: reqUrl,
    data: JSON.stringify( {...newRoom, image: imageName ? imageName : imageUrl ? imageUrl : undefined, formData: undefined} ),
    withCredentials: true,
  });

  if (errorSavingData) {
    error = errorSavingData;
    console.error(error);
    throw new Error('Room cound not be saved!');
  }

  const room = data?.data?.rooms;

  // return result.rooms;
  return {data: room, error};  
};

const uploadImage = async function (image) {
  let backendUrl;

  console.log({image});

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  if (!image) {
    console.error('Missing image file! Unable to upload image!');
    throw new Error('Missing image file! Unable to upload image!');
  }

  let reqUrl = `${backendUrl}api/v1/rooms/image`;
  let method = 'POST';

  const { data, error}  = await axios({
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
    },
    url: reqUrl,
    data: image,
    withCredentials: true,
  });

  if (error) {
    console.error(error);
    throw new Error('Room image cound not be saved!');
  }  

  const imageName = data?.data?.imageName;

  // return result.supaimage;
  return {data: {imageName}, error};  
}
