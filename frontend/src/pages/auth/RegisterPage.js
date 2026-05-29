import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRegisterClientMutation, useRegisterTutorMutation } from '@shared/api/authApi';
import { registerSchema } from '@features/auth/schemas';
export default function RegisterPage({ role = 'client' }) {
    const [registerClient, { isLoading: loadingClient }] = useRegisterClientMutation();
    const [registerTutor, { isLoading: loadingTutor }] = useRegisterTutorMutation();
    const isLoading = loadingClient || loadingTutor;
    const [serverError, setServerError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(registerSchema), // заглушка
        defaultValues: {
            languageCode: 'de',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    });
    const onSubmit = async (data) => {
        setServerError(null);
        const { confirmPassword, ...dto } = data;
        try {
            if (role === 'tutor') {
                await registerTutor(dto).unwrap();
            }
            else {
                await registerClient(dto).unwrap();
            }
            setSuccess(true);
        }
        catch (err) {
            setServerError(err?.data?.message ?? 'Registrierung fehlgeschlagen.');
        }
    };
    if (success) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\u2709\uFE0F" }), _jsx("h2", { className: "text-xl font-bold mb-2", children: "Best\u00E4tigungs-E-Mail gesendet" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Bitte \u00FCberpr\u00FCfen Sie Ihr Postfach und klicken Sie auf den Aktivierungslink." }), _jsx(Link, { to: "/login", className: "mt-6 inline-block text-blue-600 hover:underline text-sm", children: "Zur Anmeldung" })] }) }));
    }
    const isTutor = role === 'tutor';
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-8", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-md p-8", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-2", children: isTutor ? 'Als Nachhilfelehrer registrieren' : 'Konto erstellen' }), _jsx("p", { className: "text-center text-sm text-gray-500 mb-6", children: isTutor
                        ? 'Ihr Profil wird nach Prüfung durch uns freigeschaltet.'
                        : 'Kostenlos und ohne Kreditkarte.' }), _jsxs("div", { className: "flex rounded-lg overflow-hidden border mb-6 text-sm", children: [_jsx(Link, { to: "/register", className: `flex-1 text-center py-2 font-medium transition
              ${!isTutor ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`, children: "Sch\u00FCler" }), _jsx(Link, { to: "/register/tutor", className: `flex-1 text-center py-2 font-medium transition
              ${isTutor ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`, children: "Nachhilfelehrer" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Vorname" }), _jsx("input", { type: "text", autoComplete: "given-name", className: `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2
                  ${errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('name') }), errors.name && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.name.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nachname" }), _jsx("input", { type: "text", autoComplete: "family-name", className: `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2
                  ${errors.surname ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('surname') }), errors.surname && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.surname.message })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "E-Mail" }), _jsx("input", { type: "email", autoComplete: "email", className: `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('email') }), errors.email && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email.message })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Passwort ", _jsx("span", { className: "text-gray-400 font-normal", children: "(mind. 15 Zeichen)" })] }), _jsx("input", { type: "password", autoComplete: "new-password", className: `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('password') }), errors.password && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.password.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Passwort best\u00E4tigen" }), _jsx("input", { type: "password", autoComplete: "new-password", className: `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.confirmPassword ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('confirmPassword') }), errors.confirmPassword && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.confirmPassword.message }))] }), serverError && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2", children: serverError })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n              text-white font-medium py-2 rounded-lg transition text-sm", children: isLoading ? 'Wird registriert...' : 'Registrieren' })] }), _jsxs("p", { className: "mt-4 text-center text-sm text-gray-500", children: ["Bereits registriert?", ' ', _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline", children: "Anmelden" })] })] }) }));
}
