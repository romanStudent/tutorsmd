import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout } from '@widgets/layout/ui/Layout';
import { TutorFilters } from './components/TutorFilters';
import { TutorList } from './components/TutorList';
export default function TutorsPage() {
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Nachhilfelehrer finden" }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 flex-shrink-0", children: _jsx(TutorFilters, {}) }), _jsx("main", { className: "flex-1 min-w-0", children: _jsx(TutorList, {}) })] })] }) }));
}
