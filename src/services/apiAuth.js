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

export async function updateUser({ password, fullName, avatar }) {
  // 1. Update password OR fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };
  const {
    data: { user: userFullNamePassword } = {},
    error: errorFullNamePassword,
  } = await supabase.auth.updateUser(updateData);

  if (errorFullNamePassword) throw new Error(error.message);

  if (!avatar) return { userFullNamePassword };

  // 2. Upload the avatar image
  const fileName = `avatar-${userFullNamePassword.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  // 3. Update avatar in the user
  updateData = {
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  };

  // https://mbehgukaiafkgmqfeboa.supabase.co/storage/v1/object/public/avatars/default-user.jpg?t=2023-08-31T18%3A11%3A58.521Z
  const { data: { user: userAvatar } = {}, error: errorAvatar } =
    await supabase.auth.updateUser(updateData);

  if (errorAvatar) throw new Error(errorAvatar.message);

  return { userAvatar };
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
