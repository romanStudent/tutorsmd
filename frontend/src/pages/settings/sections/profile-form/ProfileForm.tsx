import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, FormData } from './schema';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@shared/api/profileApi';
import { Spinner } from '@shared/index';
import { useTranslation } from 'react-i18next';

export const ProfileForm = () => {
  const { t } = useTranslation('settings');

  const { data: profile, isLoading } = useGetUserProfileQuery();
  const [update, { isLoading: saving, isSuccess }] = useUpdateUserProfileMutation();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name:         profile.name,
        surname:      profile.surname,
        username:     profile.username ?? '',
        timezone:     profile.timezone,
        languageCode: profile.languageCode,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    await update(data).unwrap().catch(() => {});
  };

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-900">{t('profile.title')}</h2>

      {isSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-4 py-3">
          {t('profile.saved')}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t('profile.fields.firstName')} error={errors.name?.message} htmlFor="name">
          <input id="name" className={inp(!!errors.name)} {...register('name')} />
        </Field>
        <Field label={t('profile.fields.lastName')} error={errors.surname?.message} htmlFor="surname">
          <input id="surname" className={inp(!!errors.surname)} {...register('surname')} />
        </Field>
      </div>

      <Field label={t('profile.fields.username')} error={errors.username?.message} htmlFor="username">
        <input id="username" className={inp(!!errors.username)} {...register('username')} />
      </Field>

      <Field label={t('profile.fields.language')} htmlFor="languageCode">
        <select id="languageCode" className={inp(false)} {...register('languageCode')}>
          <option value="de">Deutsch</option>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </Field>

      <Field label={t('profile.fields.timezone')} htmlFor="timezone">
        <input id="timezone" className={inp(false)} {...register('timezone')} />
      </Field>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {t('profile.fields.email')}
        </label>
        <div className="flex items-center gap-3">
          <input
            value={profile?.email ?? ''}
            readOnly
            className="flex-1 border border-slate-200 bg-slate-50 rounded-xl
              px-4 py-3 text-sm text-slate-500"
          />
          {profile?.isEmailVerified ? (
            <span className="flex-shrink-0 text-xs text-green-700 bg-green-50
              border border-green-200 px-3 py-1.5 rounded-full font-medium">
              {t('profile.emailVerified')}
            </span>
          ) : (
            <span className="flex-shrink-0 text-xs text-amber-700 bg-amber-100
              px-3 py-1.5 rounded-full font-medium">
              {t('profile.emailNotVerified')}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || !isDirty}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50
          text-white text-sm font-medium px-6 py-2.5 rounded-xl transition
          shadow-lg shadow-orange-200"
      >
        {saving ? t('profile.saving') : t('profile.save')}
      </button>
    </form>
  );
};

const inp = (hasError: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4
   ${hasError
     ? 'border-red-400 focus:ring-red-100'
     : 'border-slate-300 focus:ring-blue-100'}`;

const Field = ({
  label, error, htmlFor, children,
}: {
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