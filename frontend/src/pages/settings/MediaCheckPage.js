import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Layout } from '@widgets/layout/ui/Layout';
export default function MediaCheckPage() {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [recorder, setRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const init = async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(s);
                if (videoRef.current)
                    videoRef.current.srcObject = s;
            }
            catch {
                setError('Kein Zugriff auf Kamera/Mikrofon. Bitte Berechtigungen prüfen.');
            }
        };
        init();
        return () => { stream?.getTracks().forEach(t => t.stop()); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const startRecording = () => {
        if (!stream)
            return;
        setAudioBlob(null);
        const chunks = [];
        const rec = new MediaRecorder(stream);
        rec.ondataavailable = (e) => { if (e.data.size > 0)
            chunks.push(e.data); };
        rec.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/wav' }));
        rec.start();
        setRecorder(rec);
        setIsRecording(true);
    };
    const stopRecording = () => {
        recorder?.stop();
        setIsRecording(false);
    };
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-3xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Kamera & Mikrofon testen" }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm\r\n            rounded-lg px-4 py-3 mb-6", children: error })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [_jsx("h2", { className: "font-semibold text-gray-900 mb-3", children: "\uD83D\uDCF7 Video" }), _jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full rounded-xl bg-gray-900 aspect-video object-cover" })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [_jsx("h2", { className: "font-semibold text-gray-900 mb-3", children: "\uD83C\uDFA4 Audio" }), _jsxs("div", { className: "flex flex-col items-center justify-center gap-4 min-h-32", children: [isRecording ? (_jsxs("button", { onClick: stopRecording, className: "flex items-center gap-2 bg-red-600 hover:bg-red-700\r\n                    text-white text-sm font-medium px-5 py-2 rounded-lg transition", children: [_jsx("span", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }), "Aufnahme stoppen"] })) : (_jsx("button", { onClick: startRecording, disabled: !stream, className: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400\r\n                    text-white text-sm font-medium px-5 py-2 rounded-lg transition", children: "\uD83C\uDF99 Aufnahme starten" })), audioBlob && (_jsxs("div", { className: "w-full", children: [_jsx("p", { className: "text-xs text-gray-500 mb-2 text-center", children: "Wiedergabe:" }), _jsx("audio", { controls: true, className: "w-full", children: _jsx("source", { src: URL.createObjectURL(audioBlob), type: "audio/wav" }) })] }))] })] })] }), _jsx("p", { className: "text-xs text-gray-400 mt-6 text-center", children: "Wenn Sie Kamera oder Mikrofon nicht sehen, pr\u00FCfen Sie die Browser-Berechtigungen." })] }) }));
}
