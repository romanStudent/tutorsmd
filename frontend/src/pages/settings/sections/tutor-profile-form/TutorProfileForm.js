import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from "./schema";
import { useGetTutorProfileQuery, useUpdateTutorProfileMutation } from '@shared/api/tutor/tutorApi';
import { Spinner } from '@shared/index';
export const TutorProfileForm = () => {
    const { data: tutor, isLoading } = useGetTutorProfileQuery();
    const [update, { isLoading: saving, isSuccess }] = useUpdateTutorProfileMutation();
    const { register, handleSubmit, reset, formState: { errors, isDirty }, } = useForm({ resolver: zodResolver(schema) });
    useEffect(() => {
        if (tutor) {
            reset({
                nameDe: tutor.nameDe,
                nameRu: tutor.nameRu,
                surnameDe: tutor.surnameDe,
                surnameRu: tutor.surnameRu,
                hourlyRate: tutor.hourlyRate,
                highlightDe: tutor.highlightDe,
                highlightRu: tutor.highlightRu,
                fulldescribeDe: tutor.fulldescribeDe,
                fulldescribeRu: tutor.fulldescribeRu,
            });
        }
    }, [tutor, reset]);
    const onSubmit = async (data) => {
        await update(data).unwrap().catch(() => { });
    };
    if (isLoading)
        return _jsx(Spinner, {});
    const approvalStatus = tutor?.approvalStatus;
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [approvalStatus === 'pending' && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3", children: [_jsx("p", { className: "text-sm text-yellow-800 font-medium", children: "Ihr Profil wird gepr\u00FCft." }), _jsx("p", { className: "text-xs text-yellow-700 mt-0.5", children: "Sie k\u00F6nnen Ihr Profil bereits ausf\u00FCllen \u2014 es wird nach der Freischaltung sichtbar." })] })), approvalStatus === 'rejected' && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl px-4 py-3", children: [_jsx("p", { className: "text-sm text-red-700 font-medium", children: "Ihr Profil wurde abgelehnt." }), _jsx("p", { className: "text-xs text-red-600 mt-0.5", children: "Bitte aktualisieren Sie Ihr Profil und warten Sie auf eine erneute Pr\u00FCfung." })] })), approvalStatus === 'approved' && (_jsx("div", { className: "bg-green-50 border border-green-200 rounded-xl px-4 py-3", children: _jsx("p", { className: "text-sm text-green-700 font-medium", children: "\u2713 Profil freigeschaltet" }) })), isSuccess && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2", children: "Gespeichert \u2713" })), _jsxs("section", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 uppercase tracking-wide", children: "Stundensatz" }), _jsxs("div", { className: "relative max-w-xs", children: [_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm", children: "\u20AC" }), _jsx("input", { type: "number", step: "0.5", min: "1", max: "10000", className: `w-full border rounded-lg pl-7 pr-4 py-2 text-sm focus:outline-none focus:ring-2
              ${errors.hourlyRate ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`, ...register('hourlyRate', { valueAsNumber: true }) })] }), errors.hourlyRate && (_jsx("p", { className: "text-red-500 text-xs", children: errors.hourlyRate.message }))] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 uppercase tracking-wide", children: "Name auf Deutsch / \u043F\u043E-\u0440\u0443\u0441\u0441\u043A\u0438" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Field, { label: "Vorname (DE)", error: errors.nameDe?.message, children: _jsx("input", { className: inp(!!errors.nameDe), ...register('nameDe') }) }), _jsx(Field, { label: "Vorname (RU)", error: errors.nameRu?.message, children: _jsx("input", { className: inp(!!errors.nameRu), ...register('nameRu') }) }), _jsx(Field, { label: "Nachname (DE)", error: errors.surnameDe?.message, children: _jsx("input", { className: inp(!!errors.surnameDe), ...register('surnameDe') }) }), _jsx(Field, { label: "Nachname (RU)", error: errors.surnameRu?.message, children: _jsx("input", { className: inp(!!errors.surnameRu), ...register('surnameRu') }) })] })] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 uppercase tracking-wide", children: "Kurzvorstellung (max. 500 Zeichen)" }), _jsx(Field, { label: "Auf Deutsch", error: errors.highlightDe?.message, children: _jsx("textarea", { rows: 3, className: inp(!!errors.highlightDe), placeholder: "z.B. Ich unterrichte Mathematik seit 5 Jahren...", ...register('highlightDe') }) }), _jsx(Field, { label: "\u041F\u043E-\u0440\u0443\u0441\u0441\u043A\u0438", error: errors.highlightRu?.message, children: _jsx("textarea", { rows: 3, className: inp(!!errors.highlightRu), placeholder: "\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u041F\u0440\u0435\u043F\u043E\u0434\u0430\u044E \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0443 \u0443\u0436\u0435 5 \u043B\u0435\u0442...", ...register('highlightRu') }) })] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 uppercase tracking-wide", children: "Ausf\u00FChrliche Beschreibung (max. 5000 Zeichen)" }), _jsx(Field, { label: "Auf Deutsch", error: errors.fulldescribeDe?.message, children: _jsx("textarea", { rows: 6, className: inp(!!errors.fulldescribeDe), placeholder: "Beschreiben Sie Ihre Erfahrung, Methodik, Erfolge...", ...register('fulldescribeDe') }) }), _jsx(Field, { label: "\u041F\u043E-\u0440\u0443\u0441\u0441\u043A\u0438", error: errors.fulldescribeRu?.message, children: _jsx("textarea", { rows: 6, className: inp(!!errors.fulldescribeRu), placeholder: "\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u0432\u043E\u0439 \u043E\u043F\u044B\u0442, \u043C\u0435\u0442\u043E\u0434\u0438\u043A\u0443, \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F...", ...register('fulldescribeRu') }) })] }), _jsx("button", { type: "submit", disabled: saving || !isDirty, className: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n          text-white text-sm font-medium px-6 py-2 rounded-lg transition", children: saving ? 'Wird gespeichert...' : 'Speichern' })] }));
};
const inp = (hasError) => `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
   ${hasError ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`;
const Field = ({ label, error, children, }) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label }), children, error && _jsx("p", { className: "text-red-500 text-xs mt-1", children: error })] }));
