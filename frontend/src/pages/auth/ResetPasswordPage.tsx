// src/pages/auth/ResetPasswordPage.tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useResetPasswordMutation } from '@shared/api/authApi';
import { resetPasswordSchema, type ResetPasswordFormData } from '@features/auth/schemas';

export default function ResetPasswordPage() {
  const { token }   = useParams<{ token: string }>();
  const navigate    = useNavigate();
  const [reset, { isLoading }] = useResetPasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setServerError(null);
    try {
      await reset({ token, newPassword: data.newPassword }).unwrap();
      navigate('/login', { state: { message: 'Passwort erfolgreich zurückgesetzt' } });
    } catch (err: any) {
      setServerError(err?.data?.message ?? 'Link ungültig oder abgelaufen.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Ungültiger Link</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Neues Passwort festlegen</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Neues Passwort <span className="text-gray-400 font-normal">(mind. 15 Zeichen)</span>
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.newPassword ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
              {...register('newPassword')}
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passwort bestätigen</label>
            <input
              type="password"
              autoComplete="new-password"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.confirmPassword ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
              text-white font-medium py-2 rounded-lg transition text-sm"
          >
            {isLoading ? 'Wird gespeichert...' : 'Passwort speichern'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/login" className="text-blue-600 hover:underline">Zurück zur Anmeldung</Link>
        </p>
      </div>
    </div>
  );
}