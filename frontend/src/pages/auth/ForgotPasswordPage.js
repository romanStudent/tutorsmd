import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForgotPasswordMutation } from '@shared/api/authApi';
import { forgotPasswordSchema } from '@features/auth/schemas';
export default function ForgotPasswordPage() {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [sent, setSent] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });
    const onSubmit = async (data) => {
        await forgotPassword(data).unwrap().catch(() => { });
        // Всегда показываем success — защита от email enumeration
        setSent(true);
    };
    if (sent) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\u2709\uFE0F" }), _jsx("h2", { className: "text-xl font-bold mb-2", children: "E-Mail gesendet" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Falls diese E-Mail existiert, haben wir einen Link zum Zur\u00FCcksetzen des Passworts gesendet." }), _jsx(Link, { to: "/login", className: "mt-6 inline-block text-blue-600 hover:underline text-sm", children: "Zur\u00FCck zur Anmeldung" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-md p-8", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-2", children: "Passwort vergessen?" }), _jsx("p", { className: "text-center text-sm text-gray-500 mb-6", children: "Wir senden Ihnen einen Link zum Zur\u00FCcksetzen." }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "E-Mail" }), _jsx("input", { type: "email", autoComplete: "email", className: `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('email') }), errors.email && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email.message })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n              text-white font-medium py-2 rounded-lg transition text-sm", children: isLoading ? 'Wird gesendet...' : 'Link senden' })] }), _jsx("p", { className: "mt-4 text-center text-sm text-gray-500", children: _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline", children: "Zur\u00FCck zur Anmeldung" }) })] }) }));
}
