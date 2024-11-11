'use client';

import SubmitButton from '@/components/elements/button/SubmitButton';
import { Form } from '@/components/ui/form';
import type { OnSuccessType, UserDetailType } from '@/types';
import { useProfileForm } from '../../hooks/useProfileForm';
import { ProfileFormFields } from './ProfileFormFields';

export default function UserProfileForm({ userDetail, onSuccess }: UserDetailType & OnSuccessType) {
  const { form, isLoading, onSubmit, handleImageDelete, handleBirthDateDelete } = useProfileForm(
    userDetail,
    onSuccess,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProfileFormFields
          form={form}
          userDetail={userDetail}
          onImageDelete={handleImageDelete}
          onBirthDateDelete={handleBirthDateDelete}
        />
        <SubmitButton className="max-w-24 float-end" label="保存" loading={isLoading} />
      </form>
    </Form>
  );
}
