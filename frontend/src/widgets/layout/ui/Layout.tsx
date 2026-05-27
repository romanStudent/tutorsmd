// Обёртка для всех страниц — Header сверху, footer снизу
import { Header } from '../../header';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1">
      {children}
    </main>
  </div>
);