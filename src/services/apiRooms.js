import axios from 'axios';

export const getRooms = async function ({filter, sortBy, page}) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let exists = false;
  backendUrl += 'api/v1/rooms';

  // FILTER  
  if (filter) {
    if (filter.discount) {
      if (filter.discount === 'all') {
        backendUrl += `?discount[gte]=0`;
      } else if (filter.discount === 'no-discount') {
        backendUrl += `?discount[eq]=0`;
      } else if (filter.discount === 'with-discount') {
        backendUrl += `?discount[gt]=0`;
      }
    } else {
      backendUrl += `?discount[gte]=0`;
    }
    exists = true;
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

  const rooms = data?.data?.rooms;
  const count = data?.data?.count;
  const from = data?.data?.from;
  const to = data?.data?.to;
  const PAGE_SIZE = data?.data?.pageSize;

  return {data: rooms, count, from, to, PAGE_SIZE, error};  
};

export const deleteRoom = async function (id) {
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
      }
    }
  );

  if (error) {
    console.error(error);
    throw new Error('Rooms data could not be loaded');
  }

  const rooms = data?.data?.rooms;

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

  return {data: room, error};  
};

const uploadImage = async function (image) {
  let backendUrl;

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

  return {data: {imageName}, error};  
}
