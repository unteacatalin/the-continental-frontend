import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { updateUser as updateUserApi } from '../../services/apiAuth';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdatingUser } = useMutation({
    mutationFn: (newUser) =>
      updateUserApi(newUser),
    onSuccess: ({ user }) => {
      toast.success('User account successfully updated');

      const userData = { ...user, jwt_expiry: Date.now() + process.env.JWT_EXPIRES_IN };
      queryClient.setQueryData(['user'], userData);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { updateUser, isUpdatingUser };
}