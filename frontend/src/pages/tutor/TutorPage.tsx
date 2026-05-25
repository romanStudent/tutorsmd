// Бывший AllTutorsPage
import { Layout }       from '@widgets/layout/Layout';
import { TutorFilters } from '@features/tutor/filter/ui/TutorFilters';
import { TutorList }    from '@widgets/tutors/TutorList';

export default function TutorsPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <TutorFilters />
        <TutorList />
      </div>
    </Layout>
  );
}