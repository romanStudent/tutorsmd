import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from './schema';
import { useRequestEmailChangeMutation } from '@shared/api/authApi';
export const ChangeEmailForm = () => {
    const [requestChange, { isLoading }] = useRequestEmailChangeMutation();
    const [sent, setSent] = useState(false);
    const [serverError, setServerError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });
    const onSubmit = async (data) => {
        setServerError(null);
        try {
            await requestChange(data).unwrap();
            setSent(true);
        }
        catch (err) {
            setServerError(err?.data?.message ?? 'Fehler beim Ändern der E-Mail.');
        }
    };
    if (sent) {
        return (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3", children: "\u2709\uFE0F Best\u00E4tigungslink an neue E-Mail gesendet. Bitte pr\u00FCfen Sie Ihr Postfach." }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "E-Mail \u00E4ndern" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Neue E-Mail" }), _jsx("input", { type: "email", className: inp(!!errors.newEmail), ...register('newEmail') }), errors.newEmail && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.newEmail.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Aktuelles Passwort (zur Best\u00E4tigung)" }), _jsx("input", { type: "password", className: inp(!!errors.password), ...register('password') }), errors.password && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.password.message })] }), serverError && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2", children: serverError })), _jsx("button", { type: "submit", disabled: isLoading, className: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n          text-white text-sm font-medium px-6 py-2 rounded-lg transition", children: isLoading ? 'Wird gesendet...' : 'Bestätigungslink senden' })] }));
};
const inp = (e) => `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
   ${e ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`;
