import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useChangePasswordMutation } from '@shared/api/authApi';
import { useTranslation } from 'react-i18next';
import { schema } from './schema';

type FormData = z.infer<typeof schema>;

export const ChangePasswordForm = () => {
  const { t } = useTranslation('settings');
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [serverError, setServerError]   = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSuccess(false);
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();
      setSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err?.data?.message ?? 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-900">
        {t('changePassword.title')}
      </h2>

      <Field label={t('changePassword.oldPassword')} error={errors.oldPassword?.message} htmlFor="oldPassword">
        <input id="oldPassword" type="password" autoComplete="current-password"
          className={inp(!!errors.oldPassword)} {...register('oldPassword')} />
      </Field>

      <Field label={t('changePassword.newPassword')} error={errors.newPassword?.message} htmlFor="newPassword">
        <input id="newPassword" type="password" autoComplete="new-password"
          className={inp(!!errors.newPassword)} {...register('newPassword')} />
      </Field>

      <Field label={t('changePassword.confirmPassword')} error={errors.confirmPassword?.message} htmlFor="confirmPassword">
        <input id="confirmPassword" type="password" autoComplete="new-password"
          className={inp(!!errors.confirmPassword)} {...register('confirmPassword')} />
      </Field>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3">
          {serverError}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-4 py-3">
          {t('changePassword.success')}
        </div>
      )}

      <button type="submit" disabled={isLoading}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50
          text-white text-sm font-medium px-6 py-2.5 rounded-xl transition
          shadow-lg shadow-orange-200">
        {isLoading ? t('changePassword.submitting') : t('changePassword.submit')}
      </button>
    </form>
  );
};

const inp = (e: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4
   ${e ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:ring-blue-100'}`;

const Field = ({ label, error, htmlFor, children }: {
  label: string; error?: string; htmlFor: string; children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
  </div>
);