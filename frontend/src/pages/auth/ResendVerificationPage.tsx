import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResendVerificationMutation } from '@shared/api/authApi';
import AuthLayout from '@widgets/auth/ui/AuthLayout';
import { authButtonClass, authInputClass } from '@shared/ui/auth/styles';

const schema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
});

type FormData = z.infer<typeof schema>;

export default function ResendVerificationPage() {
  const [resend, { isLoading }] = useResendVerificationMutation();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await resend(data.email).unwrap().catch(() => {});
    // Всегда показываем success — защита от email enumeration
    setSent(true);
  };

if (sent) {
  return (
    <AuthLayout
      title="E-Mail gesendet"
      subtitle="Aktivierungslink wurde angefordert"
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
          Falls diese E-Mail registriert und nicht aktiviert ist,
          haben wir einen neuen Aktivierungslink gesendet.
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
          Zur Anmeldung
        </Link>

      </div>
    </AuthLayout>
  );
}
return (
  <AuthLayout
    title="Aktivierungslink erneut senden"
    subtitle="Wir senden Ihnen einen neuen Aktivierungslink"
  >
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div>
        <label
          htmlFor="email"
          className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            dark:text-slate-300
          "
        >
          E-Mail
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          className={authInputClass}
          {...register('email')}
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={authButtonClass}
      >
        {isLoading
          ? 'Wird gesendet...'
          : 'Link senden'}
      </button>
    </form>

    <p className="mt-6 text-center text-sm text-slate-500">
      <Link
        to="/login"
        className="
          font-medium
          text-blue-600
          hover:text-blue-700
        "
      >
        Zurück zur Anmeldung
      </Link>
    </p>
  </AuthLayout>
);
}