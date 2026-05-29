import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from "./schema";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@shared/api/profileApi';
import { Spinner } from '@shared/index';
export const ProfileForm = () => {
    const { data: profile, isLoading } = useGetUserProfileQuery();
    const [update, { isLoading: saving, isSuccess }] = useUpdateUserProfileMutation();
    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(schema),
    });
    // Заполняем форму данными из API
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name,
                surname: profile.surname,
                username: profile.username ?? '',
                timezone: profile.timezone,
                languageCode: profile.languageCode,
            });
        }
    }, [profile, reset]);
    const onSubmit = async (data) => {
        await update(data).unwrap().catch(() => { });
    };
    if (isLoading)
        return _jsx(Spinner, {});
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Pers\u00F6nliche Daten" }), isSuccess && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2", children: "Gespeichert \u2713" })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Vorname", error: errors.name?.message, children: _jsx("input", { className: input(!!errors.name), ...register('name') }) }), _jsx(Field, { label: "Nachname", error: errors.surname?.message, children: _jsx("input", { className: input(!!errors.surname), ...register('surname') }) })] }), _jsx(Field, { label: "Benutzername", error: errors.username?.message, children: _jsx("input", { className: input(!!errors.username), ...register('username') }) }), _jsx(Field, { label: "Sprache", children: _jsxs("select", { className: input(false), ...register('languageCode'), children: [_jsx("option", { value: "de", children: "Deutsch" }), _jsx("option", { value: "ru", children: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" }), _jsx("option", { value: "en", children: "English" })] }) }), _jsx(Field, { label: "Zeitzone", children: _jsx("input", { className: input(false), ...register('timezone') }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "E-Mail" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { value: profile?.email ?? '', readOnly: true, className: "flex-1 border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-500" }), !profile?.isEmailVerified && (_jsx("span", { className: "text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded", children: "Nicht verifiziert" }))] })] }), _jsx("button", { type: "submit", disabled: saving || !isDirty, className: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n          text-white text-sm font-medium px-6 py-2 rounded-lg transition", children: saving ? 'Wird gespeichert...' : 'Speichern' })] }));
};
const input = (hasError) => `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
   ${hasError ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`;
const Field = ({ label, error, children, }) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label }), children, error && _jsx("p", { className: "text-red-500 text-xs mt-1", children: error })] }));
