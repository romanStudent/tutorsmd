import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRegisterClientMutation, useRegisterTutorMutation } from '@shared/api/authApi';
import { registerSchema, type RegisterFormData } from '@features/auth/schemas';

interface Props {
  role?: 'client' | 'tutor';
}

export default function RegisterPage({ role = 'client' }: Props) {
  const [registerClient, { isLoading: loadingClient }] = useRegisterClientMutation();
  const [registerTutor,  { isLoading: loadingTutor }]  = useRegisterTutorMutation();
  const isLoading = loadingClient || loadingTutor;

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterFormData>,   // заглушка
    defaultValues: {
      languageCode: 'de',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    const { confirmPassword, ...dto } = data;
    try {
      if (role === 'tutor') {
        await registerTutor(dto).unwrap();
      } else {
        await registerClient(dto).unwrap();
      }
      setSuccess(true);
    } catch (err: any) {
      setServerError(
        err?.data?.message ?? 'Registrierung fehlgeschlagen.',
      );
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-xl font-bold mb-2">Bestätigungs-E-Mail gesendet</h2>
          <p className="text-gray-600 text-sm">
            Bitte überprüfen Sie Ihr Postfach und klicken Sie auf den Aktivierungslink.
          </p>
          <Link to="/login" className="mt-6 inline-block text-blue-600 hover:underline text-sm">
            Zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  const isTutor = role === 'tutor';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-2xl font-bold text-center mb-2">
          {isTutor ? 'Als Nachhilfelehrer registrieren' : 'Konto erstellen'}
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          {isTutor
            ? 'Ihr Profil wird nach Prüfung durch uns freigeschaltet.'
            : 'Kostenlos und ohne Kreditkarte.'}
        </p>

        {/* Role switcher */}
        <div className="flex rounded-lg overflow-hidden border mb-6 text-sm">
          <Link
            to="/register"
            className={`flex-1 text-center py-2 font-medium transition
              ${!isTutor ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Schüler
          </Link>
          <Link
            to="/register/tutor"
            className={`flex-1 text-center py-2 font-medium transition
              ${isTutor ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Nachhilfelehrer
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

          {/* Name + Surname */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
              <input
                type="text"
                autoComplete="given-name"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2
                  ${errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                {...register('name')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
              <input
                type="text"
                autoComplete="family-name"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2
                  ${errors.surname ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                {...register('surname')}
              />
              {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              autoComplete="email"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passwort <span className="text-gray-400 font-normal">(mind. 15 Zeichen)</span>
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passwort bestätigen</label>
            <input
              type="password"
              autoComplete="new-password"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.confirmPassword ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Server error */}
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
            {isLoading ? 'Wird registriert...' : 'Registrieren'}
          </button>

        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Bereits registriert?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Anmelden</Link>
        </p>

      </div>
    </div>
  );
}