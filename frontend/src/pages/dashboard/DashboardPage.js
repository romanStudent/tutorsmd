import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Бывший CabinetPage
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import { ClientDashboard } from './ClientDashboard';
import { TutorDashboard } from './TutorDashboard';
import { AdminDashboard } from './AdminDashboard';
import { Layout } from '@widgets/layout/index';
export default function DashboardPage() {
    const role = useSelector(selectActiveRole);
    return (_jsxs(Layout, { children: [role === 'client' && _jsx(ClientDashboard, {}), role === 'tutor' && _jsx(TutorDashboard, {}), role === 'admin' && _jsx(AdminDashboard, {})] }));
}
