import { LanguageCode } from '../../domain/entities/User';

type Lang = LanguageCode | string | undefined;

const t = {
  activation: {
    subject: { en: 'Activate Your Account', de: 'Konto aktivieren', ru: 'Активация аккаунта' },
    greeting: { en: 'Welcome!', de: 'Willkommen!', ru: 'Добро пожаловать!' },
    instruction: {
      en: 'Thank you for registering. Please activate your account within 24 hours.',
      de: 'Danke für Ihre Registrierung. Bitte aktivieren Sie Ihr Konto innerhalb von 24 Stunden.',
      ru: 'Спасибо за регистрацию. Пожалуйста, активируйте аккаунт в течение 24 часов.',
    },
    button: { en: 'Activate Account', de: 'Konto aktivieren', ru: 'Активировать аккаунт' },
    footer: {
      en: "If you didn't register, ignore this email.",
      de: 'Falls Sie sich nicht registriert haben, ignorieren Sie diese E-Mail.',
      ru: 'Если вы не регистрировались, проигнорируйте это письмо.',
    },
  },
  passwordReset: {
    subject: { en: 'Password Reset', de: 'Passwort zurücksetzen', ru: 'Сброс пароля' },
    greeting: { en: 'Password Reset', de: 'Passwort zurücksetzen', ru: 'Сброс пароля' },
    instruction: {
      en: 'You requested a password reset. The link is valid for 15 minutes.',
      de: 'Sie haben eine Passwortzurücksetzung angefordert. Der Link ist 15 Minuten gültig.',
      ru: 'Вы запросили сброс пароля. Ссылка действительна 15 минут.',
    },
    button: { en: 'Reset Password', de: 'Passwort zurücksetzen', ru: 'Сбросить пароль' },
    footer: {
      en: "If you didn't request this, ignore this email.",
      de: 'Falls Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail.',
      ru: 'Если вы не запрашивали это, проигнорируйте письмо.',
    },
  },
  emailChange: {
    subject: { en: 'Confirm New Email', de: 'Neue E-Mail bestätigen', ru: 'Подтверждение новой почты' },
    greeting: { en: 'Security Update', de: 'Sicherheitsupdate', ru: 'Обновление безопасности' },
    instruction: {
      en: 'You requested to change your email address. Please confirm within 48 hours.',
      de: 'Sie haben eine E-Mail-Änderung angefordert. Bitte bestätigen Sie innerhalb von 48 Stunden.',
      ru: 'Вы запросили смену email. Подтвердите в течение 48 часов.',
    },
    button: { en: 'Confirm New Email', de: 'Neue E-Mail bestätigen', ru: 'Подтвердить новый email' },
    footer: {
      en: "If you didn't initiate this change, contact support immediately.",
      de: 'Falls Sie diese Änderung nicht initiiert haben, kontaktieren Sie sofort den Support.',
      ru: 'Если вы не инициировали это изменение, срочно обратитесь в поддержку.',
    },
  },

  emailChangeNotification: {
    subject: {
      en: 'Your email is being changed',
      de: 'Ihre E-Mail-Adresse wird geändert',
      ru: 'Смена email-адреса',
    },
    greeting: {
      en: 'Security Alert',
      de: 'Sicherheitshinweis',
      ru: 'Уведомление безопасности',
    },
    instruction: {
      en: 'A request to change your email address was initiated. If this was you, confirm via the link sent to your new address. If not — contact support immediately.',
      de: 'Eine Anfrage zur Änderung Ihrer E-Mail-Adresse wurde gestellt. Falls Sie das waren, bestätigen Sie über den Link an Ihre neue Adresse. Falls nicht — kontaktieren Sie sofort den Support.',
      ru: 'Был отправлен запрос на смену вашего email. Если это были вы — подтвердите по ссылке на новый адрес. Если нет — немедленно обратитесь в поддержку.',
    },
    button: {
      en: 'Contact Support',
      de: 'Support kontaktieren',
      ru: 'Связаться с поддержкой',
    },

    cancelButton: {
      en: 'Cancel Email Change',
      de: 'E-Mail-Änderung abbrechen',
      ru: 'Отменить смену email',
    },
    footer: {
      en: 'If you initiated this change, no action is required on this address.',
      de: 'Wenn Sie diese Änderung initiiert haben, ist keine Aktion auf dieser Adresse erforderlich.',
      ru: 'Если вы инициировали это изменение, никаких действий на этом адресе не требуется.',
    },
  },

  lessonReminder: {
    subject: { en: 'Lesson Reminder', de: 'Unterrichtserinnerung', ru: 'Напоминание об уроке' },
    greeting: { en: 'Hello!', de: 'Hallo!', ru: 'Привет!' },
    button: { en: 'Join Lesson', de: 'Unterricht beitreten', ru: 'Присоединиться к уроку' },
    footer: {
      en: 'We recommend joining 5 minutes before the start.',
      de: 'Wir empfehlen, 5 Minuten vor Beginn beizutreten.',
      ru: 'Рекомендуем присоединиться за 5 минут до начала.',
    },
  },
  tutorApproved: {
    subject: { en: 'Your profile is approved!', de: 'Ihr Profil wurde genehmigt!', ru: 'Ваш профиль одобрен!' },
    greeting: { en: 'Congratulations!', de: 'Herzlichen Glückwunsch!', ru: 'Поздравляем!' },
    instruction: {
      en: 'Your tutor profile has been approved. You can now accept students.',
      de: 'Ihr Tutorenprofil wurde genehmigt. Sie können jetzt Schüler annehmen.',
      ru: 'Ваш профиль тьютора одобрен. Теперь вы можете принимать учеников.',
    },
    button: { en: 'Go to Dashboard', de: 'Zum Dashboard', ru: 'Перейти в кабинет' },
    footer: {
      en: 'Thank you for joining TutorsMD.',
      de: 'Danke, dass Sie TutorsMD beigetreten sind.',
      ru: 'Спасибо, что присоединились к TutorsMD.',
    },
  },
  tutorRejected: {
    subject: { en: 'Profile Review Update', de: 'Profilprüfung Aktualisierung', ru: 'Обновление проверки профиля' },
    greeting: { en: 'Profile Review', de: 'Profilprüfung', ru: 'Проверка профиля' },
    instruction: {
      en: 'Unfortunately, your tutor profile was not approved at this time. You may update your profile and reapply.',
      de: 'Leider wurde Ihr Tutorenprofil derzeit nicht genehmigt. Sie können Ihr Profil aktualisieren und erneut beantragen.',
      ru: 'К сожалению, ваш профиль тьютора не был одобрен. Вы можете обновить профиль и подать заявку снова.',
    },
    button: { en: 'Update Profile', de: 'Profil aktualisieren', ru: 'Обновить профиль' },
    footer: {
      en: 'Contact support if you have questions.',
      de: 'Kontaktieren Sie den Support bei Fragen.',
      ru: 'Обратитесь в поддержку если есть вопросы.',
    },
  },
};

type TranslationKey = keyof typeof t;

function getLang(language: Lang): 'en' | 'de' | 'ru' {
  if (language === 'de' || language === 'ru') return language;
  return 'en';
}

function tr(key: TranslationKey, field: string, language: Lang): string {
  const lang = getLang(language);
  const section = t[key] as Record<string, Record<string, string>>;
  return section[field]?.[lang] ?? section[field]?.['en'] ?? '';
}

export class EmailTemplates {
  private static base(opts: {
    greeting: string;
    instruction: string;
    buttonText: string;
    link: string;
    footerText: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
    <div style="background:#2563eb;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px">TutorsMD</h1>
    </div>
    <div style="padding:32px">
      <h2 style="color:#1f2937;margin-top:0">${opts.greeting}</h2>
      <p style="color:#4b5563;line-height:1.6">${opts.instruction}</p>
      <div style="text-align:center;margin:32px 0">
        <a href="${opts.link}"
           style="background:#2563eb;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">
          ${opts.buttonText}
        </a>
      </div>
      <p style="color:#9ca3af;font-size:13px">${opts.footerText}</p>
    </div>
  </div>
</body>
</html>`;
  }

  static activation(link: string, language?: Lang): { subject: string; html: string } {
    return {
      subject: tr('activation', 'subject', language),
      html: this.base({
        greeting: tr('activation', 'greeting', language),
        instruction: tr('activation', 'instruction', language),
        buttonText: tr('activation', 'button', language),
        link,
        footerText: tr('activation', 'footer', language),
      }),
    };
  }

  static passwordReset(link: string, language?: Lang): { subject: string; html: string } {
    return {
      subject: tr('passwordReset', 'subject', language),
      html: this.base({
        greeting: tr('passwordReset', 'greeting', language),
        instruction: tr('passwordReset', 'instruction', language),
        buttonText: tr('passwordReset', 'button', language),
        link,
        footerText: tr('passwordReset', 'footer', language),
      }),
    };
  }

  static emailChange(link: string, language?: Lang): { subject: string; html: string } {
    return {
      subject: tr('emailChange', 'subject', language),
      html: this.base({
        greeting: tr('emailChange', 'greeting', language),
        instruction: tr('emailChange', 'instruction', language),
        buttonText: tr('emailChange', 'button', language),
        link,
        footerText: tr('emailChange', 'footer', language),
      }),
    };
  }

   static emailChangeNotification(
  confirmLink: string,
  cancelLink:  string,
  language?:   Lang,
): { subject: string; html: string } {
  const lang = getLang(language);

  const confirmBtn = {
    en: 'Yes, I initiated this',
    de: 'Ja, ich habe das initiiert',
    ru: 'Да, это был я',
  }[lang];

  const cancelBtn = {
    en: 'Cancel email change',
    de: 'E-Mail-Änderung abbrechen',
    ru: 'Отменить смену email',
  }[lang];

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;
    overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
    <div style="background:#2563eb;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px">TutorsMD</h1>
    </div>
    <div style="padding:32px">
      <h2 style="color:#1f2937;margin-top:0">
        ${tr('emailChangeNotification', 'greeting', language)}
      </h2>
      <p style="color:#4b5563;line-height:1.6">
        ${tr('emailChangeNotification', 'instruction', language)}
      </p>
      <div style="display:flex;gap:12px;justify-content:center;margin:32px 0;flex-wrap:wrap">
        <a href="${confirmLink}"
           style="background:#2563eb;color:#fff;padding:14px 24px;border-radius:6px;
             text-decoration:none;font-weight:bold;display:inline-block">
          ${confirmBtn}
        </a>
        <a href="${cancelLink}"
           style="background:#dc2626;color:#fff;padding:14px 24px;border-radius:6px;
             text-decoration:none;font-weight:bold;display:inline-block">
          ${cancelBtn}
        </a>
      </div>
      <p style="color:#9ca3af;font-size:13px">
        ${tr('emailChangeNotification', 'footer', language)}
      </p>
    </div>
  </div>
</body>
</html>`;

  return {
    subject: tr('emailChangeNotification', 'subject', language),
    html,
  };
}

  static lessonReminder(time: string, language?: Lang): { subject: string; html: string } {
    const lang = getLang(language);
    const instruction = {
      en: `Your lesson is scheduled for ${time}. Join the virtual classroom below.`,
      de: `Ihr Unterricht ist für ${time} geplant. Treten Sie dem virtuellen Klassenzimmer bei.`,
      ru: `Ваш урок запланирован на ${time}. Присоединитесь к виртуальному классу ниже.`,
    }[lang];

    return {
      subject: `${tr('lessonReminder', 'subject', language)} — ${time}`,
      html: this.base({
        greeting: tr('lessonReminder', 'greeting', language),
        instruction,
        buttonText: tr('lessonReminder', 'button', language),
        link: '',
        footerText: tr('lessonReminder', 'footer', language),
      }),
    };
  }

  static tutorApproved(language?: Lang): { subject: string; html: string } {
    const dashboardUrl = process.env.CLIENT_URL ?? '';
    return {
      subject: tr('tutorApproved', 'subject', language),
      html: this.base({
        greeting: tr('tutorApproved', 'greeting', language),
        instruction: tr('tutorApproved', 'instruction', language),
        buttonText: tr('tutorApproved', 'button', language),
        link: dashboardUrl,
        footerText: tr('tutorApproved', 'footer', language),
      }),
    };
  }

  static tutorRejected(language?: Lang): { subject: string; html: string } {
    const profileUrl = `${process.env.CLIENT_URL ?? ''}/profile`;
    return {
      subject: tr('tutorRejected', 'subject', language),
      html: this.base({
        greeting: tr('tutorRejected', 'greeting', language),
        instruction: tr('tutorRejected', 'instruction', language),
        buttonText: tr('tutorRejected', 'button', language),
        link: profileUrl,
        footerText: tr('tutorRejected', 'footer', language),
      }),
    };
  }
}