import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@entities/user/model/selectors';
import { HeroSection } from '@widgets/hero/HeroSection';
import { TutorsPreview } from '@widgets/tutors-preview/TutorsPreview';
import { SubjectsSection } from '@widgets/subjects/SubjectsSection';
import { FaqSection } from '@widgets/faq/FaqSection';
import { Layout } from '@widgets/layout/index';
export default function HomePage() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    if (isAuthenticated) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return (_jsxs(Layout, { children: [_jsx(HeroSection, {}), _jsx(TutorsPreview, {}), _jsx(SubjectsSection, {}), _jsx(FaqSection, {})] }));
}
