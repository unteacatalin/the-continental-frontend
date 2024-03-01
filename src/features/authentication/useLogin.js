import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { login as loginApi } from '../../services/apiAuth';
// import { jwtExpiry } from '../../utils/supabase';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      let jwt_expiry;

      console.log({user});

      if (import.meta.env.NETLIFY === 'true') {
        jwt_expiry = Date.now() + process.env.VITE_JWT_EXPIRES_IN * 60 * 60 * 1000;
      } else {
        jwt_expiry = Date.now() + import.meta.env.VITE_JWT_EXPIRES_IN * 60 * 60 * 1000;
      }

      const userData = { ...user, jwt_expiry };
      queryClient.setQueryData(['user'], userData);
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.error('ERROR', err);
      toast.error('Invalid login credentials');
    },
  });

  return { login, isLoading };
}