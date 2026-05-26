import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import { useGetUserLessonsQuery } from '@shared/api/lessonApi';
import { Layout }     from '@widgets/layout/ui/Layout';
import { LessonCard } from '@widgets/lesson-card/ui/LessonCard';
import { Spinner }    from '@shared/index';
import type { LessonStatus } from '@entities/lesson/model/types';
import { Role } from '@entities/user/model/types';

const STATUS_TABS: { label: string; statuses: LessonStatus[] | undefined }[] = [
  { label: 'Alle',           statuses: undefined },
  { label: 'Anfragen',       statuses: ['pending'] },
  { label: 'Bestätigt',      statuses: ['confirmed'] },
  { label: 'Abgeschlossen',  statuses: ['completed'] },
  { label: 'Storniert',      statuses: ['cancelled_by_client', 'cancelled_by_tutor'] },
];

export default function LessonsPage() {
  const role = useSelector(selectActiveRole);
  const [activeTab, setActiveTab] = useState(0);

  const tab = STATUS_TABS[activeTab];

  // RTK Query — передаём первый статус если задан (бэкенд фильтрует)
  const { data, isLoading } = useGetUserLessonsQuery(
    tab.statuses ? { status: tab.statuses[0] } : {},
  );

  // Клиентская фильтрация для множественных статусов
  const lessons = data?.lessons.filter((l) =>
    tab.statuses ? tab.statuses.includes(l.status) : true,
  ) ?? [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Meine Unterrichtsstunden
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {STATUS_TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px
                ${activeTab === i
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <Spinner />
        ) : lessons.length === 0 ? (
          <EmptyState role={role} />
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                role={role as Role ?? 'client'}
              />
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}

const EmptyState = ({ role }: { role: string | null }) => (
  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
    <p className="text-4xl mb-3">📅</p>
    <p className="text-gray-500 text-sm">
      {role === 'tutor'
        ? 'Keine Unterrichtsstunden gefunden.'
        : 'Sie haben noch keine Unterrichtsstunden.'}
    </p>
  </div>
);