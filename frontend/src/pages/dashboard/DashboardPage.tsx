// Бывший CabinetPage
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import { ClientDashboard } from '@widgets/dashboard/ClientDashboard';
import { TutorDashboard }  from '@widgets/dashboard/TutorDashboard';
import { AdminDashboard }  from '@widgets/dashboard/AdminDashboard';
import { Layout }          from '@widgets/layout/Layout';

export default function DashboardPage() {
  const role = useSelector(selectActiveRole);

  return (
    <Layout>
      {role === 'client' && <ClientDashboard />}
      {role === 'tutor'  && <TutorDashboard />}
      {role === 'admin'  && <AdminDashboard />}
    </Layout>
  );
}