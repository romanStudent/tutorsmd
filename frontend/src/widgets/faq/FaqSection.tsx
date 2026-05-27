import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const FAQ = {
  de: {
    title: 'Häufige Fragen',
    more:  'Alle Fragen ansehen',
    items: [
      { q: 'Wie lange dauert eine Unterrichtsstunde?',
        a: 'Eine Unterrichtsstunde dauert 75 Minuten.' },
      { q: 'Wie funktioniert die Probestunde?',
        a: 'Sie buchen eine Probestunde mit einem Lehrer. Nach der Stunde entscheiden Sie, ob Sie regelmäßig weiterlernen möchten.' },
      { q: 'Wo findet der Unterricht statt?',
        a: 'Alles findet online auf unserer Plattform statt — mit Video, Chat und interaktivem Whiteboard.' },
      { q: 'Wie kann ich einen Unterricht absagen?',
        a: 'In Ihrem Bereich sehen Sie Ihre nächsten Unterrichte. Kostenlose Absage bis zu 24 Stunden vorher.' },
    ],
  },
  ru: {
    title: 'Частые вопросы',
    more:  'Все вопросы',
    items: [
      { q: 'Сколько длится урок?',
        a: 'Один урок длится 75 минут.' },
      { q: 'Как проходит пробный урок?',
        a: 'Вы записываетесь на пробный урок с преподавателем. После урока решаете, хотите ли продолжать.' },
      { q: 'Где проходят уроки?',
        a: 'Всё онлайн на нашей платформе — видео, чат и интерактивная доска.' },
      { q: 'Как отменить урок?',
        a: 'В кабинете видны ближайшие уроки. Бесплатная отмена за 24 часа.' },
    ],
  },
  en: {
    title: 'FAQ',
    more:  'View all questions',
    items: [
      { q: 'How long is a lesson?',
        a: 'One lesson lasts 75 minutes.' },
      { q: 'How does the trial lesson work?',
        a: 'You book a trial lesson with a tutor. Afterwards you decide if you want to continue.' },
      { q: 'Where do lessons take place?',
        a: 'Everything is online on our platform — video, chat and interactive whiteboard.' },
      { q: 'How do I cancel a lesson?',
        a: 'Your dashboard shows your upcoming lessons. Free cancellation up to 24 hours before.' },
    ],
  },
};

export const FaqSection = () => {
  const { i18n } = useTranslation();
  const lang     = i18n.language as 'de' | 'ru' | 'en';
  const data     = FAQ[lang] ?? FAQ.de;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
        <Link to="/faq" className="text-sm text-blue-600 hover:underline">
          {data.more} →
        </Link>
      </div>

      <div className="space-y-2">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left
                text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
            >
              <span>{item.q}</span>
              <span className={`text-gray-400 transition-transform duration-200 flex-shrink-0
                ${open === i ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 pt-2 text-sm text-gray-600 leading-relaxed
                border-t border-gray-100">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};