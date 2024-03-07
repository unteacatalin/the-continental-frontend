import supabase from "../utils/supabase";
import axios from 'axios';

export const getSettings = async function () {
  // const { data, error } = await supabase.from("settings").select("*").single();

  // if (error) {
  //   console.error(error);
  //   throw new Error("Settings could not be loaded");
  // }
  // return data;

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

  console.log({settings: data});

  if (error) {
    console.error(error);
    throw new Error('Settings data could not be fetched');
  }

  const settings = data?.data?.settings;

  // return result.rooms;
  return {data: settings, error};  
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}