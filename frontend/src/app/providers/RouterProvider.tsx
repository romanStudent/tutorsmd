import { lazy } from 'react';
import { createBrowserRouter, RouterProvider as RRProvider, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useSessionManager } from '@app/hooks/useSessionManager';

const lazyRetry = (fn: () => Promise<any>) =>
  fn().catch(() => { window.location.reload(); throw new Error('chunk_reload'); });


// AUTH
const LoginPage              = lazy(() => lazyRetry(() => import('@pages/auth/LoginPage')));
const RegisterPage           = lazy(() => lazyRetry(() => import('@pages/auth/RegisterPage')));
const ActivatePage           = lazy(() => lazyRetry(() => import('@pages/auth/ActivatePage')));
const ResendVerificationPage = lazy(() => lazyRetry(() => import('@pages/auth/ResendVerificationPage')));
const ForgotPasswordPage     = lazy(() => lazyRetry(() => import('@pages/auth/ForgotPasswordPage')));
const ResetPasswordPage      = lazy(() => lazyRetry(() => import('@pages/auth/ResetPasswordPage')));

// PUBLIC
const HomePage    = lazy(() => lazyRetry(() => import('@pages/home/HomePage')));
const TutorsPage  = lazy(() => lazyRetry(() => import('@pages/tutors/TutorsPage')));
const TutorPage   = lazy(() => lazyRetry(() => import('@pages/tutors/TutorPage')));
const AboutPage   = lazy(() => lazyRetry(() => import('@pages/about/AboutPage')));
const FaqPage     = lazy(() => lazyRetry(() => import('@pages/faq/FaqPage')));
const PrivacyPage = lazy(() => lazyRetry(() => import('@pages/privacy/PrivacyPage')));

// PRIVATE
const DashboardPage    = lazy(() => lazyRetry(() => import('@pages/dashboard/DashboardPage')));
const LessonsPage      = lazy(() => lazyRetry(() => import('@pages/lesson/LessonsPage')));
const LessonPage       = lazy(() => lazyRetry(() => import('@pages/lesson/LessonPage')));
const SettingsPage     = lazy(() => lazyRetry(() => import('@pages/settings/SettingsPage')));
const MediaCheckPage   = lazy(() => lazyRetry(() => import('@pages/settings/sections/media-check/MediaCheckPage')));
const SupportChatPage  = lazy(() => lazyRetry(() => import('@pages/support-chat/SupportChatPage')));
const LikedTutorsPage  = lazy(() => lazyRetry(() => import('@pages/liked-tutors/LikedTutorsPage')));

// ADMIN
const AdminMessagesPage = lazy(() => lazyRetry(() => import('@pages/admin/AdminMessagesPage')));

const AppShell = () => {
  useSessionManager();
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
  // PUBLIC
  { path: '/',                      element: <HomePage /> },
  { path: '/tutors',                element: <TutorsPage /> },
  { path: '/tutors/:tutorId',       element: <TutorPage /> },
  { path: '/about',                 element: <AboutPage /> },
  { path: '/faq',                   element: <FaqPage /> },
  { path: '/privacy',               element: <PrivacyPage /> },

  // AUTH
  { path: '/login',                 element: <LoginPage /> },
  { path: '/register',              element: <RegisterPage /> },
  { path: '/activate/:token',       element: <ActivatePage /> },
  { path: '/resend-verification',   element: <ResendVerificationPage /> },
  { path: '/forgot-password',       element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },

  // PRIVATE (любой залогиненный)
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',           element: <DashboardPage /> },
      { path: '/lessons',             element: <LessonsPage /> },
      { path: '/lessons/:lessonId',   element: <LessonPage /> },
      { path: '/settings',            element: <SettingsPage /> },
      { path: '/settings/media',      element: <MediaCheckPage /> },
      { path: '/support',             element: <SupportChatPage /> },
      { path: '/liked-tutors',        element: <LikedTutorsPage /> },
    ],
  },

  // ADMIN
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      { path: '/admin/messages', element: <AdminMessagesPage /> },
    ],
  },

  // FALLBACK
  { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
 
]);

export const RouterProvider = () => <RRProvider router={router} />;
