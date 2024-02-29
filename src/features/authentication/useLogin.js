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
      const userData = { ...user.user, jwt_expiry: Date.now() + process.env.JWT_EXPIRES_IN };
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