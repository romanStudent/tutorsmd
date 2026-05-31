import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useActivateAccountMutation } from '@shared/api/authApi';
import AuthLayout from '@widgets/auth/ui/AuthLayout';
import { useTranslation } from 'react-i18next';

type State = 'loading' | 'success' | 'error' | 'invalid';

export default function ActivatePage() {
  const { t } = useTranslation('auth');
  const { token } = useParams<{ token: string }>();
  const [activate] = useActivateAccountMutation();
  const [state, setState]     = useState<State>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setState('invalid'); return; }

    const run = async () => {
      try {
        await activate({ token }).unwrap();
        setState('success');
      } catch (err: any) {
        setErrorMsg(err?.data?.message ?? t('errors.invalidLink'));
        setState('error');
      }
    };
    run();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // loading не нуждается в AuthLayout — показываем минималистичный спиннер
  if (state === 'loading') {
    return (
      <AuthLayout title="" subtitle="">
        <div className="flex flex-col items-center py-6 gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent
            rounded-full animate-spin" />
          <p className="text-sm text-slate-500">{t('activatePage.loading')}</p>
        </div>
      </AuthLayout>
    );
  }

  if (state === 'success') {
    return (
      <AuthLayout title={t('activatePage.successTitle')} subtitle={t('activatePage.successText')}>
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200
            flex items-center justify-center text-3xl">
            ✅
          </div>
          <Link
            to="/login"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm
              font-medium py-3 rounded-xl transition text-center shadow-lg shadow-orange-200"
          >
            {t('activatePage.successBtn')}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (state === 'error') {
    return (
      <AuthLayout title={t('activatePage.errorTitle')} subtitle={errorMsg}>
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200
            flex items-center justify-center text-3xl">
            ❌
          </div>
          <div className="w-full space-y-2">
            <Link
              to="/resend-verification"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-sm
                font-medium py-3 rounded-xl transition text-center shadow-lg shadow-orange-200"
            >
              {t('activatePage.errorResend')}
            </Link>
            <Link
              to="/login"
              className="block w-full text-sm text-slate-500 hover:text-slate-700
                transition text-center py-2"
            >
              {t('activatePage.errorLogin')}
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // invalid
  return (
    <AuthLayout title={t('activatePage.invalidTitle')} subtitle={t('activatePage.invalidText')}>
      <div className="flex flex-col items-center gap-5 py-2">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200
          flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <Link
          to="/login"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          {t('activatePage.invalidLogin')}
        </Link>
      </div>
    </AuthLayout>
  );
}