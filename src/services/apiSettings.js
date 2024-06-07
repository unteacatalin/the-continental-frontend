import axios from 'axios';

export const getSettings = async function () {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  const { data, error }  = await axios.get(
    `${backendUrl}api/v1/settings`,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
    }
    }
  );

  if (error) {
    console.error(error);
    throw new Error('Settings data could not be fetched');
  }

  const settings = data?.data?.settings;

  // return result.rooms;
  return { settings, error};  
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSettings) {
  let backendUrl;

  if (import.meta.env.NETLIFY === 'true') {
    backendUrl = process.env.VITE_CONTINENTAL_BACKEND_URL;
  } else {
    backendUrl = import.meta.env.VITE_CONTINENTAL_BACKEND_URL;
  }

  let reqUrl = `${backendUrl}api/v1/settings`;
  let method = 'PATCH';  

  const { data, error: errorSavingData}  = await axios({
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    url: reqUrl,
    data: JSON.stringify(newSettings),
    withCredentials: true,
  });  


  if (errorSavingData) {
    error = errorSavingData;
    console.error(error);
    throw new Error('Room cound not be saved!');
  }

  const settings = data?.data?.settings;

  return settings; 
}