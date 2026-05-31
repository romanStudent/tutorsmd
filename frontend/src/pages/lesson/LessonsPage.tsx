import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import { useGetUserLessonsQuery } from '@shared/api/lessonApi';
import { Layout }     from '@widgets/layout/ui/Layout';
import { LessonCard } from '@widgets/lesson-card/ui/LessonCard';
import { Spinner }    from '@shared/index';
import { useTranslation } from 'react-i18next';
import type { LessonStatus } from '@entities/lesson/model/types';
import type { Role } from '@entities/user/model/types';

const STATUS_TABS: { key: string; statuses: LessonStatus[] | undefined }[] = [
  { key: 'all',       statuses: undefined },
  { key: 'pending',   statuses: ['pending'] },
  { key: 'confirmed', statuses: ['confirmed'] },
  { key: 'completed', statuses: ['completed'] },
  { key: 'cancelled', statuses: ['cancelled_by_client', 'cancelled_by_tutor'] },
];

export default function LessonsPage() {
  const { t } = useTranslation('lessons');
  const role = useSelector(selectActiveRole);
  const [activeTab, setActiveTab] = useState(0);

  const tab = STATUS_TABS[activeTab];

  const { data, isLoading } = useGetUserLessonsQuery(
    tab.statuses ? { status: tab.statuses[0] } : {},
  );

  const lessons = data?.lessons.filter((l) =>
    tab.statuses ? tab.statuses.includes(l.status) : true,
  ) ?? [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
          {t('title')}
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
          {STATUS_TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px
                ${activeTab === i
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t(`tabs.${tab.key}`)}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <Spinner />
        ) : lessons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-slate-500 text-sm">
              {role === 'tutor' ? t('empty.tutor') : t('empty.client')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                role={(role as Role) ?? 'client'}
              />
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}

