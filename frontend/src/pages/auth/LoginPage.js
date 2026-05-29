import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useLoginMutation } from '@shared/api/authApi';
import { loginSchema } from '@features/auth/schemas';
// Коды ошибок бэкенда → человекочитаемые сообщения + доп. действие
const EMAIL_NOT_VERIFIED_MSG = 'Please verify your email before logging in';
export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [login, { isLoading }] = useLoginMutation();
    const [serverError, setServerError] = useState(null);
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    // Сообщение от ResetPasswordPage после успешного сброса
    const successMessage = location.state?.message;
    const { register, handleSubmit, watch, getValues, formState: { errors }, } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { activeRole: 'client' },
    });
    const activeRole = watch('activeRole');
    const onSubmit = async (data) => {
        setServerError(null);
        setEmailNotVerified(false);
        try {
            await login(data).unwrap();
            navigate('/dashboard');
        }
        catch (err) {
            const msg = err?.data?.message ?? '';
            if (msg === EMAIL_NOT_VERIFIED_MSG) {
                setEmailNotVerified(true);
            }
            else {
                setServerError(msg || 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
            }
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-md p-8", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "Anmelden" }), successMessage && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 text-sm\r\n            rounded-lg px-4 py-3 mb-4", children: successMessage })), _jsx("div", { className: "flex rounded-lg overflow-hidden border mb-6", children: ['client', 'tutor'].map((role) => (_jsxs("label", { className: `flex-1 text-center py-2 cursor-pointer text-sm font-medium transition
                ${activeRole === role
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'}`, children: [_jsx("input", { type: "radio", value: role, className: "hidden", ...register('activeRole') }), role === 'client' ? 'Schüler' : 'Nachhilfelehrer'] }, role))) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "E-Mail" }), _jsx("input", { type: "email", autoComplete: "email", className: `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.email
                                        ? 'border-red-500 focus:ring-red-300'
                                        : 'border-gray-300 focus:ring-blue-300'}`, ...register('email') }), errors.email && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email.message }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Passwort" }), _jsx(Link, { to: "/forgot-password", className: "text-xs text-blue-600 hover:underline", children: "Paaswort Vergessen?" })] }), _jsx("input", { type: "password", autoComplete: "current-password", className: `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.password
                                        ? 'border-red-500 focus:ring-red-300'
                                        : 'border-gray-300 focus:ring-blue-300'}`, ...register('password') }), errors.password && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.password.message }))] }), emailNotVerified && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3", children: [_jsx("p", { className: "text-yellow-800 text-sm font-medium", children: "E-Mail nicht best\u00E4tigt" }), _jsx("p", { className: "text-yellow-700 text-xs mt-1", children: "Bitte best\u00E4tigen Sie Ihre E-Mail-Adresse. Kein E-Mail erhalten?" }), _jsx(Link, { to: "/resend-verification", state: { email: getValues('email') }, className: "inline-block mt-2 text-xs font-medium text-yellow-800\r\n                  underline hover:text-yellow-900", children: "Neuen Aktivierungslink anfordern \u2192" })] })), serverError && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm\r\n              rounded-lg px-4 py-2", children: serverError })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n              text-white font-medium py-2 rounded-lg transition text-sm", children: isLoading ? 'Wird angemeldet...' : 'Anmelden' })] }), _jsxs("p", { className: "mt-4 text-center text-sm text-gray-500", children: ["Noch kein Konto?", ' ', _jsx(Link, { to: "/register", className: "text-blue-600 hover:underline", children: "Registrieren" })] })] }) }));
}
