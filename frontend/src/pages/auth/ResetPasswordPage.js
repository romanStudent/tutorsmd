import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/auth/ResetPasswordPage.tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useResetPasswordMutation } from '@shared/api/authApi';
import { resetPasswordSchema } from '@features/auth/schemas';
import { useTranslation } from 'react-i18next';
export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [reset, { isLoading }] = useResetPasswordMutation();
    const [serverError, setServerError] = useState(null);
    const { t } = useTranslation('auth');
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });
    const onSubmit = async (data) => {
        if (!token)
            return;
        setServerError(null);
        try {
            await reset({ token, newPassword: data.newPassword }).unwrap();
            navigate('/login', { state: { message: 'Passwort erfolgreich zurückgesetzt' } });
        }
        catch (err) {
            setServerError(err?.data?.message ?? 'Link ungültig oder abgelaufen.');
        }
    };
    if (!token) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-red-500", children: "Ung\u00FCltiger Link" }) }));
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-md p-8", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: t('resetPassword.title') }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [t('resetPassword.newPassword.label'), ' ', _jsx("span", { className: "text-gray-400 font-normal", children: t('resetPassword.newPassword.hint') })] }), _jsx("input", { type: "password", autoComplete: "new-password", className: `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
            ${errors.newPassword ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('newPassword') }), errors.newPassword && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.newPassword.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t('resetPassword.confirmPassword.label') }), _jsx("input", { type: "password", autoComplete: "new-password", className: `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
            ${errors.confirmPassword ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('confirmPassword') }), errors.confirmPassword && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.confirmPassword.message }))] }), serverError && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2", children: serverError })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n          text-white font-medium py-2 rounded-lg transition text-sm", children: isLoading ? t('resetPassword.submitting') : t('resetPassword.submit') })] }), _jsx("p", { className: "mt-4 text-center text-sm text-gray-500", children: _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline", children: t('resetPassword.backToLogin') }) })] }) }));
}
