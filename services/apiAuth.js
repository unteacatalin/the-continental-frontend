const supabase = require('../utils/supabase');

exports.login = async function ({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
};

exports.logout = async function () {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
};
