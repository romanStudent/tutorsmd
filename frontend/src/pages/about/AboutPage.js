import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Layout } from '@widgets/layout/ui/Layout';
export default function AboutPage() {
    const { t } = useTranslation('about');
    return (_jsx(Layout, { children: _jsx("div", { className: "min-h-screen", style: {
                backgroundColor: 'white',
                backgroundImage: 'radial-gradient(circle, rgba(243,134,17,0.1) 3px, transparent 1px)',
                backgroundSize: '20px 20px',
            }, children: _jsxs("div", { className: "max-w-3xl mx-auto px-6 py-16 text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: t('greeting') }), _jsx("p", { className: "text-lg text-gray-700 leading-relaxed whitespace-pre-line", children: t('content') })] }) }) }));
}
