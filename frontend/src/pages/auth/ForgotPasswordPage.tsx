import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForgotPasswordMutation } from '@shared/api/authApi';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@features/auth/schemas';
import AuthLayout from '@widgets/auth/ui/AuthLayout';

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword(data).unwrap().catch(() => {});
    // Всегда показываем success — защита от email enumeration
    setSent(true);
  };

  if (sent) {
  return (
    <AuthLayout
      title="E-Mail gesendet"
      subtitle="Überprüfen Sie Ihren Posteingang"
    >
      <div className="text-center">

        <div
          className="
            mx-auto
            mb-6

            flex
            h-20
            w-20
            items-center
            justify-center

            rounded-full

            bg-green-100

            text-4xl
          "
        >
          ✉️
        </div>

        <p
          className="
            text-sm
            leading-relaxed
            text-slate-600
            dark:text-slate-400
          "
        >
          Falls diese E-Mail existiert, haben wir einen Link zum
          Zurücksetzen des Passworts gesendet.
        </p>

        <Link
          to="/login"
          className="
            mt-6
            inline-block

            font-medium

            text-blue-600
            hover:text-blue-700
          "
        >
          Zurück zur Anmeldung
        </Link>

      </div>
    </AuthLayout>
  );
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Passwort vergessen?</h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Wir senden Ihnen einen Link zum Zurücksetzen.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
              text-white font-medium py-2 rounded-lg transition text-sm"
          >
            {isLoading ? 'Wird gesendet...' : 'Link senden'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/login" className="text-blue-600 hover:underline">Zurück zur Anmeldung</Link>
        </p>
      </div>
    </div>
  );
}