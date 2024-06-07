import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUpdateUser } from './useUpdateUser';

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  const { updateUser, isUpdatingUser } = useUpdateUser();

  function onSubmit({ currentPassword, newPassword }) {
    reset();
    // Disabled so no one can change my password!!!
    updateUser(
      { currentPassword, newPassword }, 
      { 
        onSuccess: reset 
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label='Current Password (min 8 characters)'
        error={errors?.currentPassword?.message}
      >
        <Input
          type='password'
          id='currentPassword'
          autoComplete='current-password'
          disabled={isUpdatingUser}
          {...register('currentPassword', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters',
            },
          })}
        />
      </FormRow>

      <FormRow
        label='New password (min 8 characters)'
        error={errors?.newPassword?.message}
      >
        <Input
          type='password'
          id='newPassword'
          autoComplete='new-password'
          disabled={isUpdatingUser}
          {...register('newPassword', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters',
            },
          })}
        />
      </FormRow>

      <FormRow
        label='Confirm password'
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type='password'
          autoComplete='confirm-password'
          id='passwordConfirm'
          disabled={isUpdatingUser}
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value) =>
              getValues().newPassword === value || 'Passwords need to match',
          })}
        />
      </FormRow>
      <FormRow>
        <Button
          onClick={reset}
          type='reset'
          variation='secondary'
          disabled={isUpdatingUser}
        >
          Cancel
        </Button>
        <Button disabled={isUpdatingUser}>Update password</Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;