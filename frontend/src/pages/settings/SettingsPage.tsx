// Бывший AccountSettings
import { Layout } from '@widgets/layout/Layout';
import { ProfileForm }         from '@features/profile/update/ui/ProfileForm';
import { ChangePasswordForm }  from '@features/auth/change-password/ui/ChangePasswordForm';
import { ChangeEmailForm }     from '@features/auth/change-email/ui/ChangeEmailForm';
import { SessionsList }        from '@features/auth/sessions/ui/SessionsList';
import { DangerZone }          from '@features/profile/danger-zone/ui/DangerZone';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <ProfileForm />
        <ChangePasswordForm />
        <ChangeEmailForm />
        <SessionsList />
        <DangerZone />
      </div>
    </Layout>
  );
}