import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from './schema';
import { useChangePasswordMutation } from '@shared/api/authApi';
import { useLogoutMutation } from '@shared/api/authApi';
import { useNavigate } from 'react-router-dom';
export const ChangePasswordForm = () => {
    const navigate = useNavigate();
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [logout] = useLogoutMutation();
    const [serverError, setServerError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });
    const onSubmit = async (data) => {
        setServerError(null);
        try {
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            }).unwrap();
            // После смены пароля — все сессии отозваны на бэкенде
            // Разлогиниваем клиент и редиректим
            await logout();
            navigate('/login', { state: { message: 'Passwort geändert. Bitte erneut anmelden.' } });
        }
        catch (err) {
            setServerError(err?.data?.message ?? 'Fehler beim Ändern des Passworts.');
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Passwort \u00E4ndern" }), _jsx(Field, { label: "Aktuelles Passwort", error: errors.oldPassword?.message, children: _jsx("input", { type: "password", autoComplete: "current-password", className: inp(!!errors.oldPassword), ...register('oldPassword') }) }), _jsx(Field, { label: "Neues Passwort (mind. 15 Zeichen)", error: errors.newPassword?.message, children: _jsx("input", { type: "password", autoComplete: "new-password", className: inp(!!errors.newPassword), ...register('newPassword') }) }), _jsx(Field, { label: "Passwort best\u00E4tigen", error: errors.confirmPassword?.message, children: _jsx("input", { type: "password", autoComplete: "new-password", className: inp(!!errors.confirmPassword), ...register('confirmPassword') }) }), serverError && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2", children: serverError })), _jsx("button", { type: "submit", disabled: isLoading, className: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n          text-white text-sm font-medium px-6 py-2 rounded-lg transition", children: isLoading ? 'Wird geändert...' : 'Passwort ändern' })] }));
};
const inp = (e) => `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
   ${e ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`;
const Field = ({ label, error, children }) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label }), children, error && _jsx("p", { className: "text-red-500 text-xs mt-1", children: error })] }));
