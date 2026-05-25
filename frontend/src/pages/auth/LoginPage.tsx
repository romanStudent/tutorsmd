import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useLoginMutation } from '@shared/api/authApi';
import { loginSchema, type LoginFormData } from '@features/auth/schemas';

export default function LoginPage() {
  const navigate  = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { activeRole: 'client' },
  });

  const activeRole = watch('activeRole');

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data).unwrap();
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(
        err?.data?.message ?? 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-2xl font-bold text-center mb-6">Anmelden</h1>

        {/* Role switcher */}
        <div className="flex rounded-lg overflow-hidden border mb-6">
          <label className={`flex-1 text-center py-2 cursor-pointer text-sm font-medium transition
            ${activeRole === 'client' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
            <input
              type="radio"
              value="client"
              className="hidden"
              {...register('activeRole')}
            />
            Schüler
          </label>
          <label className={`flex-1 text-center py-2 cursor-pointer text-sm font-medium transition
            ${activeRole === 'tutor' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
            <input
              type="radio"
              value="tutor"
              className="hidden"
              {...register('activeRole')}
            />
            Nachhilfelehrer
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail
            </label>
            <input
              type="email"
              autoComplete="email"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passwort
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
              text-white font-medium py-2 rounded-lg transition text-sm"
          >
            {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>

        </form>

        <div className="mt-4 text-center text-sm text-gray-500 space-y-2">
          <div>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Passwort vergessen?
            </Link>
          </div>
          <div>
            Noch kein Konto?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Registrieren
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}