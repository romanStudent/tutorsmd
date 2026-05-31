import { Layout } from '@widgets/layout/index';
import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation('privacy');

  const sections = t('sections', { returnObjects: true }) as { title: string; content: string }[];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-10">
          {t('title')}
        </h1>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-base font-semibold text-slate-900 mb-2">{s.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-14">{t('footer')}</p>
      </div>
    </Layout>
  );
}