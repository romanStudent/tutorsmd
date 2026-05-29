import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Layout } from '@widgets/layout/ui/Layout';
import { ProfileForm } from './sections/profile-form/ProfileForm';
import { ChangePasswordForm } from './sections/change-password/ChangePasswordForm';
import { ChangeEmailForm } from './sections/change-email/ChangeEmailForm';
import { SessionsList } from './sections/session-list/SessionList';
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import { TutorProfileForm } from './sections/tutor-profile-form/TutorProfileForm';
export default function SettingsPage() {
    const role = useSelector(selectActiveRole);
    const [tab, setTab] = useState('profile');
    const tabs = [
        { key: 'profile', label: 'Profil' },
        ...(role === 'tutor'
            ? [{ key: 'tutor-profile', label: 'Lehrerprofil' }]
            : []),
        { key: 'security', label: 'Sicherheit' },
        { key: 'sessions', label: 'Sitzungen' },
    ];
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Einstellungen" }), _jsx("div", { className: "flex border-b border-gray-200 mb-8 gap-1", children: tabs.map((t) => (_jsx("button", { onClick: () => setTab(t.key), className: `px-4 py-2 text-sm font-medium transition border-b-2 -mb-px
                ${tab === t.key
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: t.label }, t.key))) }), tab === 'profile' && _jsx(ProfileForm, {}), tab === 'tutor-profile' && _jsx(TutorProfileForm, {}), tab === 'security' && (_jsxs("div", { className: "space-y-8", children: [_jsx(ChangePasswordForm, {}), _jsx(ChangeEmailForm, {})] })), tab === 'sessions' && _jsx(SessionsList, {})] }) }));
}
