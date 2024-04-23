import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { createEditGuest } from '../../services/apiGuests';

export function useEditGuest() {
  const queryClient = useQueryClient();

  const { mutate: editGuest, isLoading: isEditing } = useMutation({
    mutationFn: ({ newGuest, countryFlag, nationality, nationalID, email, fullName, id }) =>
      createEditGuest({...newGuest, countryFlag, nationality, nationalID, email, fullName, id}),
    onSuccess: () => {
      toast.success('Guest successfully edited');
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { editGuest, isEditing };
}