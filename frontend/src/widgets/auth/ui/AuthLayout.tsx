import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '@shared/ui/LanguageSwitcher/LanguageSwitcher';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg';
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  maxWidth = 'md'
}: AuthLayoutProps) {
    const widthClass =
  maxWidth === 'lg'
    ? 'max-w-lg'
    : 'max-w-md';
  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center

        px-4
        py-8

        bg-gradient-to-br
        from-slate-50
        via-white
        to-blue-50

        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-950
      "
    >
      <section
        className={`
          w-full
          ${widthClass}

          rounded-3xl

          border
          border-slate-200
          dark:border-slate-800

          bg-white/95
          dark:bg-slate-900/95

          backdrop-blur-sm

          shadow-xl

          p-8
          sm:p-10
        `}
      >
        <div className="flex items-center justify-between mb-8">

          <Link
            to="/"
            className="
              text-xl
              font-bold
              tracking-tight

              text-slate-900
              dark:text-white
            "
          >
            TutorsMD
          </Link>

          <LanguageSwitcher />
        </div>

        <header className="mb-8">
          <h1
            className="
              text-center

              text-3xl
              font-bold
              tracking-tight

              text-slate-900
              dark:text-white
            "
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="
                mt-2
                text-center
                text-sm

                text-slate-500
                dark:text-slate-400
              "
            >
              {subtitle}
            </p>
          )}
        </header>

        {children}
      </section>
    </main>
  );
}