import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfirmEmailChangeMutation } from '@shared/api/authApi';
import { Layout } from '@widgets/layout/index';

export default function ConfirmEmailChangePage() {
  const { token } = useParams<{ token: string }>();
  const [confirm] = useConfirmEmailChangeMutation();

  const [status, setStatus]   = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Ungültiger Link'); return; }

    confirm({ token })
      .unwrap()
      .then(() => {
        setStatus('success');
        setMessage('Ihre E-Mail-Adresse wurde erfolgreich geändert.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.data?.message ?? 'Link ungültig oder abgelaufen.');
      });
  }, [token]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200
          p-8 text-center space-y-4">

          {status === 'loading' && (
            <>
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent
                rounded-full animate-spin mx-auto" />
              <p className="text-slate-500 text-sm">Wird verarbeitet...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center
                justify-center mx-auto text-3xl">✓</div>
              <h1 className="text-xl font-bold text-slate-900">E-Mail bestätigt</h1>
              <p className="text-slate-500 text-sm">{message}</p>
              <p className="text-slate-400 text-xs">
                Bitte melden Sie sich mit Ihrer neuen E-Mail-Adresse an.
              </p>
              <Link to="/login"
                className="inline-block mt-2 bg-blue-600 hover:bg-blue-700
                  text-white text-sm font-medium px-6 py-2.5 rounded-xl transition">
                Zum Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center
                justify-center mx-auto text-3xl">✕</div>
              <h1 className="text-xl font-bold text-slate-900">Fehler</h1>
              <p className="text-slate-500 text-sm">{message}</p>
              <Link to="/support"
                className="inline-block mt-2 bg-slate-100 hover:bg-slate-200
                  text-slate-700 text-sm font-medium px-6 py-2.5 rounded-xl transition">
                Support kontaktieren
              </Link>
            </>
          )}

        </div>
      </div>
    </Layout>
  );
}