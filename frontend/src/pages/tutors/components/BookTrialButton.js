import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTrialLessonMutation } from '@shared/api/lessonApi';
export const BookTrialButton = ({ tutorId }) => {
    const navigate = useNavigate();
    const [createTrial, { isLoading }] = useCreateTrialLessonMutation();
    const [error, setError] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [open, setOpen] = useState(false);
    const handleBook = async () => {
        if (!date || !time) {
            setError('Bitte Datum und Uhrzeit wählen.');
            return;
        }
        setError(null);
        try {
            const result = await createTrial({
                tutorId,
                subjectId: '', // TODO: выбор предмета
                scheduledAt: new Date(`${date}T${time}`).toISOString(),
            }).unwrap();
            navigate(`/lessons/${result.lessonId}`);
        }
        catch (err) {
            setError(err?.data?.message ?? 'Fehler beim Buchen.');
        }
    };
    if (!open) {
        return (_jsx("button", { onClick: () => setOpen(true), className: "inline-block bg-white text-blue-600 font-medium text-sm\r\n          px-6 py-2 rounded-lg hover:bg-blue-50 transition", children: "Probestunde buchen" }));
    }
    return (_jsxs("div", { className: "space-y-3 max-w-xs mx-auto", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "date", value: date, min: new Date().toISOString().split('T')[0], onChange: (e) => setDate(e.target.value), className: "flex-1 border border-white/30 bg-white/10 text-white rounded-lg\r\n            px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50\r\n            placeholder-white/60" }), _jsx("input", { type: "time", value: time, onChange: (e) => setTime(e.target.value), className: "flex-1 border border-white/30 bg-white/10 text-white rounded-lg\r\n            px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" })] }), error && _jsx("p", { className: "text-red-200 text-xs text-center", children: error }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setOpen(false), className: "flex-1 text-sm text-white/70 hover:text-white transition", children: "Abbrechen" }), _jsx("button", { onClick: handleBook, disabled: isLoading, className: "flex-1 bg-white text-blue-600 font-medium text-sm\r\n            px-4 py-2 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition", children: isLoading ? '...' : 'Bestätigen' })] })] }));
};
