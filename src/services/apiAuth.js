import axios from 'axios';
import supabase from '../utils/supabase';
import { supabaseUrl } from '../utils/supabase';

export async function signup({ fullName, email, password }) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const {
    data,
    error,
  } = await axios({
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: `${backendUrl}api/v1/users/signup`,
    data: JSON.stringify({
      email,
      password,
      options: {
        data: {
          fullName,
          avatar: '',
        },
      },      
    }),
    withCredentials: true,
  });

  if (error) throw new Error(error);

  const user = data?.data?.user;

  if (!user) throw new Error('Signing up failed! Please try again later!');

  return user;  
}

export async function login({ email, password }) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const {
    data,
    error,
  } = await axios({
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: `${backendUrl}api/v1/users/signin`,
    data: JSON.stringify({
      email,
      password,
    }),
    withCredentials: true,
  });

  if (error) throw new Error(error);

  const user = data?.data?.user;

  if (!user) throw new Error('Authentication failed! Please try again later!');

  return user;
}

export async function getCurrentUser(existingUserData, logout) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  if (!existingUserData.jwt_expiry || existingUserData.jwt_expiry < Date.now()) {
    logout();
    return null;
  } else {
    const { data, error } = await axios({
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      url: `${backendUrl}api/v1/users/me`, 
      withCredentials: true
    });
  
    if (error) throw new Error(error);

    const user = data?.data?.user;
  
    const newUserData = { ...user, jwt_expiry: existingUserData.jwt_expiry };

    return newUserData;
  }
}

export async function logout() {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const { data, error } = await axios({
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: `${backendUrl}api/v1/users/signout`, 
    withCredentials: true
  });

  if (error) throw new Error(error.message);
}

export async function updateUser(newUser) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }
  
  const avatar = newUser?.formData;
  console.log({"updateUser-newUser": newUser, avatar});
  let error, imageName;
  
  // 1. Upload the avatar image
  if (avatar) {
    const {data, error: errorUploadingFile} = await uploadImage(avatar);
    if (errorUploadingFile) {
      error = errorUploadingFile;
      throw new Error(error);
    } else {
      imageName = data?.imageName;
    }
  }  
  
  const imageUrl= newUser?.avatar;
  let reqUrl = `${backendUrl}api/v1/users/me`;
  const method = 'PATCH';

  // 2. Update password OR fullName
  const { data, error: errorSavingData}  = await axios({
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: reqUrl,
    data: JSON.stringify( {...newUser, avatar: imageName ? imageName : imageUrl ? imageUrl : undefined, formData: undefined} ),
    withCredentials: true,
  });

  if (errorSavingData) {
    error = errorSavingData;
    console.error(error);
    throw new Error('User data cound not be saved!');
  }

  const user = data?.data?.user;

  return {data: user, error};  
}

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

  let reqUrl = `${backendUrl}api/v1/users/image`;
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
    throw new Error('Avatar image cound not be saved!');
  }  

  const imageName = data?.data?.imageName;

  return {data: {imageName}, error};  
}
