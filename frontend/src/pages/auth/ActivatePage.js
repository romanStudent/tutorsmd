import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useActivateAccountMutation } from '@shared/api/authApi';
export default function ActivatePage() {
    const { token } = useParams();
    const [activate] = useActivateAccountMutation();
    const [state, setState] = useState('loading');
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        if (!token) {
            setState('invalid');
            return;
        }
        const run = async () => {
            try {
                await activate({ token }).unwrap();
                setState('success');
            }
            catch (err) {
                setErrorMsg(err?.data?.message ?? 'Aktivierungslink ungültig oder abgelaufen.');
                setState('error');
            }
        };
        run();
    }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center", children: [state === 'loading' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-10 h-10 border-4 border-blue-600 border-t-transparent\r\n              rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Konto wird aktiviert..." })] })), state === 'success' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-5xl mb-4", children: "\u2705" }), _jsx("h1", { className: "text-xl font-bold text-gray-900 mb-2", children: "Konto erfolgreich aktiviert!" }), _jsx("p", { className: "text-gray-500 text-sm mb-6", children: "Sie k\u00F6nnen sich jetzt anmelden." }), _jsx(Link, { to: "/login", className: "inline-block bg-blue-600 hover:bg-blue-700 text-white\r\n                text-sm font-medium px-6 py-2 rounded-lg transition", children: "Zur Anmeldung" })] })), state === 'error' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-5xl mb-4", children: "\u274C" }), _jsx("h1", { className: "text-xl font-bold text-gray-900 mb-2", children: "Aktivierung fehlgeschlagen" }), _jsx("p", { className: "text-gray-500 text-sm mb-6", children: errorMsg }), _jsxs("div", { className: "space-y-2", children: [_jsx(Link, { to: "/resend-verification", className: "block bg-blue-600 hover:bg-blue-700 text-white\r\n                  text-sm font-medium px-6 py-2 rounded-lg transition", children: "Neuen Link anfordern" }), _jsx(Link, { to: "/login", className: "block text-sm text-gray-500 hover:text-gray-700 transition", children: "Zur Anmeldung" })] })] })), state === 'invalid' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-5xl mb-4", children: "\u26A0\uFE0F" }), _jsx("h1", { className: "text-xl font-bold text-gray-900 mb-2", children: "Ung\u00FCltiger Link" }), _jsx("p", { className: "text-gray-500 text-sm mb-6", children: "Der Aktivierungslink ist ung\u00FCltig." }), _jsx(Link, { to: "/login", className: "inline-block text-sm text-blue-600 hover:underline", children: "Zur Anmeldung" })] }))] }) }));
}
