import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGetSessionsQuery, useRevokeSessionMutation, useRevokeAllSessionsMutation } from '@shared/api/authApi';
import { useLogoutMutation } from '@shared/api/authApi';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@shared/index';
export const SessionsList = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetSessionsQuery();
    const [revokeSession] = useRevokeSessionMutation();
    const [revokeAll] = useRevokeAllSessionsMutation();
    const [logout] = useLogoutMutation();
    const handleRevokeAll = async () => {
        await revokeAll();
        await logout();
        navigate('/login');
    };
    if (isLoading)
        return _jsx(Spinner, {});
    const sessions = data?.sessions ?? [];
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["Aktive Sitzungen (", sessions.length, ")"] }), _jsx("button", { onClick: handleRevokeAll, className: "text-sm text-red-600 hover:underline", children: "Alle abmelden" })] }), sessions.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500", children: "Keine aktiven Sitzungen." })) : (_jsx("div", { className: "space-y-2", children: sessions.map((session) => (_jsxs("div", { className: "bg-white border border-gray-100 rounded-xl p-4\r\n                flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: session.deviceInfo ?? 'Unbekanntes Gerät' }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: ["Erstellt: ", new Date(session.createdAt).toLocaleDateString('de-DE'), ' · ', "L\u00E4uft ab: ", new Date(session.expiresAt).toLocaleDateString('de-DE')] })] }), _jsx("button", { onClick: () => revokeSession({ tokenHash: session.tokenHash }), className: "text-xs text-red-500 hover:text-red-700 transition", children: "Abmelden" })] }, session.tokenHash))) }))] }));
};
