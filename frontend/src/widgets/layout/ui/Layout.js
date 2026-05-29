import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Обёртка для всех страниц — Header сверху, footer снизу
import { Footer } from '@widgets/footer/ui/Footer';
import { Header } from '../../header';
export const Layout = ({ children }) => (_jsxs("div", { className: "min-h-screen flex flex-col bg-gray-50", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1", children: children }), _jsx(Footer, {})] }));
