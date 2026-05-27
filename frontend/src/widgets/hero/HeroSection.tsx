import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@entities/user/model/selectors';
import { useTranslation } from 'react-i18next';

export const HeroSection = () => {
  const { i18n } = useTranslation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const lang = i18n.language;

  const content = {
    de: {
      title:    'Finden Sie Ihren idealen Nachhilfelehrer',
      subtitle: 'Online-Unterricht in Mathematik und Deutsch — flexibel, effektiv, persönlich.',
      cta:      'Lehrer finden',
      login:    'Anmelden',
      badge:    'Probestunde verfügbar',
    },
    ru: {
      title:    'Найдите своего идеального репетитора',
      subtitle: 'Онлайн-уроки по математике и немецкому — гибко, эффективно, персонально.',
      cta:      'Найти учителя',
      login:    'Войти',
      badge:    'Пробный урок доступен',
    },
    en: {
      title:    'Find your ideal tutor',
      subtitle: 'Online lessons in Math and German — flexible, effective, personal.',
      cta:      'Find a tutor',
      login:    'Sign in',
      badge:    'Trial lesson available',
    },
  };

  const t = content[lang as keyof typeof content] ?? content.de;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />

      <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <div className="max-w-2xl">

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm
            text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            ✨ {t.badge}
          </span>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            {t.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/tutors"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl
                hover:bg-blue-50 transition text-sm"
            >
              {t.cta}
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="border border-white/40 text-white font-medium px-6 py-3
                  rounded-xl hover:bg-white/10 transition text-sm"
              >
                {t.login}
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12">
            {[
              { value: '2+',   label: lang === 'ru' ? 'года опыта' : 'Jahre Erfahrung' },
              { value: '100%', label: lang === 'ru' ? 'онлайн' : 'Online' },
              { value: '75',   label: lang === 'ru' ? 'мин / урок' : 'Min / Stunde' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-blue-200 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};