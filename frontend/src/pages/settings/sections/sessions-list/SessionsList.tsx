import { useGetSessionsQuery, useRevokeSessionMutation, useRevokeAllSessionsMutation } from '@shared/api/authApi';
import { useLogoutMutation } from '@shared/api/authApi';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@shared/index';
import { useTranslation } from 'react-i18next';

export const SessionsList = () => {
  const { t } = useTranslation('settings');

  const navigate = useNavigate();
  const { data, isLoading } = useGetSessionsQuery();
  const [revokeSession] = useRevokeSessionMutation();
  const [revokeAll]     = useRevokeAllSessionsMutation();
  const [logout]        = useLogoutMutation();

  const handleRevokeAll = async () => {
    await revokeAll();
    await logout();
    navigate('/login');
  };

  if (isLoading) return <Spinner />;

  const sessions = data?.sessions ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          {t('sessions.title')} ({sessions.length})
        </h2>
        <button
          onClick={handleRevokeAll}
          className="self-start sm:self-auto text-sm text-red-600
            hover:text-red-700 hover:underline transition"
        >
          {t('sessions.revokeAll')}
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-slate-500">{t('sessions.empty')}</p>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.tokenHash}
              className="bg-white border border-slate-200 rounded-2xl p-4
                flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {session.deviceInfo ?? t('sessions.unknownDevice')}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('sessions.createdAt')}: {new Date(session.createdAt).toLocaleDateString('de-DE')}
                  {' · '}
                  {t('sessions.expiresAt')}: {new Date(session.expiresAt).toLocaleDateString('de-DE')}
                </p>
              </div>
              <button
                onClick={() => revokeSession({ tokenHash: session.tokenHash })}
                className="self-start sm:self-auto text-xs font-medium text-red-500
                  hover:text-red-700 transition border border-red-200 hover:border-red-300
                  px-3 py-1.5 rounded-lg"
              >
                {t('sessions.revoke')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};