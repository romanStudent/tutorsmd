import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@widgets/layout/ui/Layout';

interface FaqItem {
  question: string;
  answer:   string;
}

const FAQ_DE: FaqItem[] = [
  {
    question: 'Wie lange dauert eine Unterrichtsstunde?',
    answer:   'Eine Unterrichtsstunde dauert 75 Minuten.',
  },
  {
    question: 'Wie kann ich Unterricht absagen?',
    answer:   'In Ihrem Bereich werden die 3 nächsten Unterrichte angezeigt. Sie können einen Unterricht bis zu 24 Stunden vorher kostenlos absagen.',
  },
  {
    question: 'Was passiert nach der Probestunde?',
    answer:   'Nach der Probestunde können Sie entscheiden, ob Sie regelmäßigen Unterricht buchen möchten.',
  },
  {
    question: 'Wie findet der Unterricht statt?',
    answer:   'Der Unterricht findet online über unsere Plattform statt — mit Video, Chat und interaktivem Whiteboard.',
  },
  {
    question: 'Wie viel kostet eine Stunde?',
    answer:   'Der Preis hängt vom Lehrer ab. Sie sehen den Preis direkt auf dem Lehrerprofil.',
  },
];

const FAQ_RU: FaqItem[] = [
  {
    question: 'Сколько длится урок?',
    answer:   'Один урок длится 75 минут.',
  },
  {
    question: 'Как отменить урок?',
    answer:   'В вашем кабинете отображаются 3 ближайших урока. Вы можете бесплатно отменить урок за 24 часа.',
  },
  {
    question: 'Что происходит после пробного урока?',
    answer:   'После пробного урока вы решаете, хотите ли вы записаться на регулярные занятия.',
  },
  {
    question: 'Как проходит урок?',
    answer:   'Урок проходит онлайн на нашей платформе — с видео, чатом и интерактивной доской.',
  },
  {
    question: 'Сколько стоит урок?',
    answer:   'Цена зависит от преподавателя. Вы видите её на странице профиля преподавателя.',
  },
];

const FAQ_EN: FaqItem[] = [
  {
    question: 'How long is a lesson?',
    answer:   'One lesson lasts 75 minutes.',
  },
  {
    question: 'How can I cancel a lesson?',
    answer:   'Your dashboard shows your next 3 lessons. You can cancel for free up to 24 hours in advance.',
  },
  {
    question: 'What happens after the trial lesson?',
    answer:   'After the trial lesson you decide whether to book regular sessions.',
  },
  {
    question: 'How does the lesson work?',
    answer:   'Lessons take place online on our platform — with video, chat, and an interactive whiteboard.',
  },
  {
    question: 'How much does a lesson cost?',
    answer:   'The price depends on the tutor and is shown on their profile page.',
  },
];

const FAQ_MAP: Record<string, FaqItem[]> = { de: FAQ_DE, ru: FAQ_RU, en: FAQ_EN };

export default function FaqPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const items = FAQ_MAP[lang] ?? FAQ_DE;
  const [open, setOpen] = useState<number | null>(null);

  const titles: Record<string, string> = {
    de: 'Häufige Fragen',
    ru: 'Частые вопросы',
    en: 'Frequently Asked Questions',
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {titles[lang] ?? titles.de}
        </h1>

        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left
                  text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
              >
                <span>{item.question}</span>
                <span className={`text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
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