import { jsx as _jsx } from "react/jsx-runtime";
export const Spinner = ({ fullscreen }) => {
    if (fullscreen) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsx("div", { className: "w-10 h-10 border-4 border-blue-600 border-t-transparent\r\n          rounded-full animate-spin" }) }));
    }
    return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "w-8 h-8 border-4 border-blue-600 border-t-transparent\r\n        rounded-full animate-spin" }) }));
};
