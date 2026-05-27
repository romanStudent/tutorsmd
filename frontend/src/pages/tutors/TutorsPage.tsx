import { Layout } from '@widgets/layout/ui/Layout';
import { TutorFilters } from './components/TutorFilters';
import { TutorList } from './components/TutorList';

export default function TutorsPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Nachhilfelehrer finden
        </h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <TutorFilters />
          </aside>
          <main className="flex-1 min-w-0">
            <TutorList />
          </main>
        </div>
      </div>
    </Layout>
  );
}