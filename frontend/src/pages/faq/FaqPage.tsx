import { useState } from 'react';
import { Layout } from '@widgets/layout/index';
import { useTranslation } from 'react-i18next';

export default function FaqPage() {
  const { t } = useTranslation('faq');

  // i18n возвращает массив напрямую через returnObjects
  const items = t('items', { returnObjects: true }) as { question: string; answer: string }[];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-10 text-center">
          {t('title')}
        </h1>

        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left
                  text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
              >
                <span>{item.question}</span>
                <span
                  className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ml-4
                    ${open === i ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>

              {open === i && (
                <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed
                  border-t border-slate-200 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}