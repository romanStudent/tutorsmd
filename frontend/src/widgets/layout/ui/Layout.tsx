// Обёртка для всех страниц — Header сверху, footer снизу
import { Footer } from '@widgets/footer/ui/Footer';
import { Header } from '../../header';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => (
   <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
