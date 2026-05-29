import { useTranslation } from 'react-i18next';
import { Layout } from '@widgets/layout/ui/Layout';

export default function AboutPage() {
  const { t } = useTranslation('about');

  return (
    <Layout>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: 'white',
          backgroundImage:
            'radial-gradient(circle, rgba(243,134,17,0.1) 3px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t('greeting')}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {t('content')}
          </p>
        </div>
      </div>
    </Layout>
  );
}