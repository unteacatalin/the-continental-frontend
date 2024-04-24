import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { createEditGuest } from '../../services/apiGuests';

export function useCreateGuest() {
  const queryClient = useQueryClient();

  const { mutate: createGuest, isLoading: isCreating } = useMutation({
    // mutationFn: ({ newGuest, countryFlag, nationality, nationalID, email }) =>
    //   createEditGuest({...newGuest, countryFlag, nationality, nationalID, email}),
    mutationFn: (newGuest) =>
      createEditGuest(newGuest),
    onSuccess: () => {
      toast.success('New guest successfully created');
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createGuest, isCreating };
}