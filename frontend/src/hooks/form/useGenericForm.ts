'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { DefaultValues, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { ZodSchema } from 'zod';

interface UseGenericFormOptions<T> {
  schema: ZodSchema;
  defaultValues: DefaultValues<T>;
  onBeforeSubmit?: (data: T) => Promise<void> | void;
  onSubmitSuccess?: (data: T) => void | Promise<void>;
  onSubmitError?: (error: unknown) => void;
}

export const useGenericForm = <T extends Record<string, unknown>>({
  schema,
  defaultValues,
  onBeforeSubmit,
  onSubmitSuccess,
  onSubmitError,
}: UseGenericFormOptions<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<T> = async (data) => {
    setIsLoading(true);
    try {
      if (onBeforeSubmit) {
        await onBeforeSubmit(data);
      }
      await onSubmitSuccess?.(data);
    } catch (error) {
      onSubmitError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading, router };
};

// 使用例
// const { form, onSubmit, isLoading, router } = useGenericForm<LoginFormData>({
//   schema: loginSchema,
//   defaultValues: {
//     email: "",
//     password: "",
//   },
// onBeforeSubmit: async (data) => {
//   if (data.email !== email) {
//     throw new Error("入力されたメールアドレスが一致しません。"); // エラーをキャッチに投げてあげる
//   }
// },
//   onSubmitSuccess: async (data) => {
//     const result = await signIn("credentials", {
//       email: data.email,
//       password: data.password,
//       redirect: false,
//     });

//     if (result?.error) {
//       throw new Error(result.error);
//     } else if (result?.ok) {
//       router.push("/");
//     }
//   },
//   onSubmitError: (error) => {
//     console.error(error);
//     toast({
//       title: "ログイン失敗",
//       description: "メールアドレスまたはパスワードが正しくありません。",
//       variant: "destructive",
//     });
//   },
// });

// return { form, onSubmit, isLoading };
// };
