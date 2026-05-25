// Бывший CabinetPage
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import { ClientDashboard } from './ClientDashboard';
import { TutorDashboard }  from './TutorDashboard';
import { AdminDashboard }  from './AdminDashboard';
import { Layout }          from '@widgets/layout/index';

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