import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DAY_NAMES = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
export const TutorSchedule = ({ slots }) => {
    const activeSlots = slots.filter((s) => s.isActive);
    if (!activeSlots.length)
        return null;
    return (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [_jsx("h2", { className: "font-semibold text-gray-900 mb-4", children: "Verf\u00FCgbarkeit" }), _jsxs("div", { className: "grid grid-cols-7 gap-1 text-center", children: [DAY_NAMES.map((d) => (_jsx("div", { className: "text-xs font-medium text-gray-400 py-1", children: d }, d))), DAY_NAMES.map((_, day) => {
                        const daySlots = activeSlots
                            .filter((s) => s.dayOfWeek === day)
                            .sort((a, b) => a.startTime.localeCompare(b.startTime));
                        return (_jsx("div", { className: "space-y-1 min-h-[24px]", children: daySlots.map((s) => (_jsx("div", { className: "text-xs bg-blue-50 text-blue-700 rounded px-1 py-0.5", title: `${s.startTime} – ${s.endTime}`, children: s.startTime }, s.id))) }, day));
                    })] })] }));
};
