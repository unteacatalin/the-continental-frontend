// import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useUpdateUser } from './useUpdateUser';

import { useUser } from './useUser';

function UpdateUserDataForm() {
  const { register, handleSubmit, reset, getValues, formState, control } = useForm();
  const { errors } = formState;
  
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser();

  const { updateUser, isUpdatingUser } = useUpdateUser();

  // const [fullName, setFullName] = useState(currentFullName);
  // const [avatar, setAvatar] = useState(null);

  function onSubmit(data) {
    const avatar = typeof data.avatar === 'string' ? data.avatar : data.avatar[0];
    console.log({ "onSubmit-data": data, "onSubmit-avatar": avatar });
    // e.preventDefault();
    // if (!fullName) return;
    // Disabled so no one can change my name!!!
    let formData;
    if (data?.image?.[0]) {
      formData = new FormData();
      // formData.append("image", typeof data.image[0] === 'file' ?? data.image[0]);
      formData.append("avatar", data?.image?.[0]);
      console.log({ avatar: data?.image?.[0] });
    }

    updateUser(
      { ...data, avatar, formData },
      {
        onSuccess: (data) => {
          // setAvatar(null);
          reset();
          // e.target.reset();
        },
      }
    );
  }

  function handleCancel() {
    // setFullName(currentFullName);
    // setAvatar(null);
  }

  function onError(error) {}

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label='Email address'>
        <Input value={email} disabled />
      </FormRow>
      <FormRow label='Full name'>
        <Input
          type='text'
          defaultValue={currentFullName}
          // onChange={(e) => setFullName(e.target.value)}
          id='fullName'
          disabled={isUpdatingUser}
          {...register('fullName', {
            required: false
          })}
        />
      </FormRow>
      <FormRow label='Avatar image'>
        <Controller
          control={control}
          name={"avatar"}
          rules={{required: false}}
          render={({field: {value, onChange, ...field}}) => {
            return (
              <FileInput
                {...field}
                value={value?.fileName}
                id='avatar'
                accept='image/*'
                disabled={isUpdatingUser}
                {...register('avatar')}
                onChange={(event) => {
                  onChange(event.target.files[0]);
                }}                
              />
            )
          }}
        />
      </FormRow>
      <FormRow>
        <Button
          type='reset'
          variation='secondary'
          disabled={isUpdatingUser}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={isUpdatingUser}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;