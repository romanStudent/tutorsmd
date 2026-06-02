import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRequestEmailChangeMutation } from '@shared/api/authApi';
import { useTranslation } from 'react-i18next';
import { schema } from './schema';


type FormData = z.infer<typeof schema>;

export const ChangeEmailForm = () => {
  const { t } = useTranslation('settings');
  const [requestEmailChange, { isLoading }] = useRequestEmailChangeMutation();
  const [serverError, setServerError]       = useState<string | null>(null);
  const [success, setSuccess]               = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSuccess(false);
    try {
      await requestEmailChange(data).unwrap();
      setSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err?.data?.message ?? 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-900">
        {t('changeEmail.title')}
      </h2>

      <div>
        <label htmlFor="newEmail" className="block text-sm font-medium text-slate-700 mb-1.5">
          {t('changeEmail.newEmail')}
        </label>
        <input id="newEmail" type="email"
          className={inp(!!errors.newEmail)} {...register('newEmail')} />
        {errors.newEmail && (
          <p className="text-red-500 text-xs mt-1.5">{errors.newEmail.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="emailPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
          {t('changeEmail.password')}
        </label>
        <input id="emailPassword" type="password"
          className={inp(!!errors.password)} {...register('password')} />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3">
          {serverError}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-4 py-3">
          {t('changeEmail.success')}
        </div>
      )}

      <button type="submit" disabled={isLoading}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50
          text-white text-sm font-medium px-6 py-2.5 rounded-xl transition
          shadow-lg shadow-orange-200">
        {isLoading ? t('changeEmail.submitting') : t('changeEmail.submit')}
      </button>
    </form>
  );
};

const inp = (e: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4
   ${e ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:ring-blue-100'}`;