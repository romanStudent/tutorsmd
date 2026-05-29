import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from 'react';
import { createBrowserRouter, RouterProvider as RRProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
// AUTH
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const ActivatePage = lazy(() => import('@pages/auth/ActivatePage'));
const ResendVerificationPage = lazy(() => import('@pages/auth/ResendVerificationPage'));
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@pages/auth/ResetPasswordPage'));
// PUBLIC
const HomePage = lazy(() => import('@pages/home/HomePage'));
const TutorsPage = lazy(() => import('@pages/tutors/TutorsPage'));
const TutorPage = lazy(() => import('@pages/tutors/TutorPage'));
const AboutPage = lazy(() => import('@pages/about/AboutPage'));
const FaqPage = lazy(() => import('@pages/faq/FaqPage'));
const PrivacyPage = lazy(() => import('@pages/privacy/PrivacyPage'));
// PRIVATE
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));
const LessonsPage = lazy(() => import('@pages/lesson/LessonsPage'));
const LessonPage = lazy(() => import('@pages/lesson/LessonPage'));
const SettingsPage = lazy(() => import('@pages/settings/SettingsPage'));
const MediaCheckPage = lazy(() => import('@pages/settings/MediaCheckPage'));
// ADMIN
const AdminMessagesPage = lazy(() => import('@pages/admin/AdminMessagesPage'));
const router = createBrowserRouter([
    // PUBLIC
    { path: '/', element: _jsx(HomePage, {}) },
    { path: '/tutors', element: _jsx(TutorsPage, {}) },
    { path: '/tutors/:tutorId', element: _jsx(TutorPage, {}) },
    { path: '/about', element: _jsx(AboutPage, {}) },
    { path: '/faq', element: _jsx(FaqPage, {}) },
    { path: '/privacy', element: _jsx(PrivacyPage, {}) },
    // AUTH
    { path: '/login', element: _jsx(LoginPage, {}) },
    { path: '/register', element: _jsx(RegisterPage, {}) },
    { path: '/register/tutor', element: _jsx(RegisterPage, { role: "tutor" }) },
    { path: '/activate/:token', element: _jsx(ActivatePage, {}) },
    { path: '/resend-verification', element: _jsx(ResendVerificationPage, {}) },
    { path: '/forgot-password', element: _jsx(ForgotPasswordPage, {}) },
    { path: '/reset-password/:token', element: _jsx(ResetPasswordPage, {}) },
    // PRIVATE
    {
        element: _jsx(ProtectedRoute, {}),
        children: [
            { path: '/dashboard', element: _jsx(DashboardPage, {}) },
            { path: '/lessons', element: _jsx(LessonsPage, {}) },
            { path: '/lessons/:lessonId', element: _jsx(LessonPage, {}) },
            { path: '/settings', element: _jsx(SettingsPage, {}) },
            { path: '/settings/media', element: _jsx(MediaCheckPage, {}) },
        ],
    },
    // ADMIN/SUPPORT
    {
        element: _jsx(ProtectedRoute, { allowedRoles: ['admin'] }),
        children: [
            { path: '/admin/messages', element: _jsx(AdminMessagesPage, {}) },
        ],
    },
    // DEFAULT/FALLBACK
    { path: '*', element: _jsx(Navigate, { to: "/", replace: true }) },
]);
export const RouterProvider = () => _jsx(RRProvider, { router: router });
