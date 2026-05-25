// Бывший App.tsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@entities/user/model/selectors';
import { HeroSection }     from '@widgets/hero/HeroSection';
import { TutorsPreview }   from '@widgets/tutors-preview/TutorsPreview';
import { SubjectsSection } from '@widgets/subjects/SubjectsSection';
import { FaqSection }      from '@widgets/faq/FaqSection';
import { Layout }          from '@widgets/layout/Layout';

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <HeroSection />
      <TutorsPreview />
      <SubjectsSection />
      <FaqSection />
    </Layout>
  );
}