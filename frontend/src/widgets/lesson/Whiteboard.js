import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Undo / Redo / Save — без MobX, только useRef + useReducer
// undo → emit board:undo → бэкенд rPop → broadcast board:pageState → все перерисовывают
// redo → emit board:action (повторный) → Redis + broadcast
import { useEffect, useRef, useReducer, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '@entities/user/model/selectors';
import { tokenManager } from '@shared/lib/TokenManager';
import { io } from 'socket.io-client';
const toolReducer = (s, p) => ({ ...s, ...p });
const initialTool = { tool: 'brush', color: '#000000', lineWidth: 3 };
const PAGE_INDEX = 0;
export const Whiteboard = ({ lessonId }) => {
    const userId = useSelector(selectUserId);
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const history = useRef([]);
    const redoStack = useRef([]);
    const drawing = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const points = useRef([]);
    const snapshot = useRef(null);
    const [toolState, dispatch] = useReducer(toolReducer, initialTool);
    const getCtx = () => canvasRef.current?.getContext('2d') ?? null;
    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvasRef.current.width / rect.width),
            y: (e.clientY - rect.top) * (canvasRef.current.height / rect.height),
        };
    };
    const applyAction = useCallback((action) => {
        const ctx = getCtx();
        if (!ctx)
            return;
        const { type, data } = action;
        ctx.save();
        switch (type) {
            case 'brush':
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = data.color;
                ctx.lineWidth = data.lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                data.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                ctx.stroke();
                break;
            case 'erase':
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = data.lineWidth;
                ctx.lineCap = 'round';
                ctx.beginPath();
                data.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                ctx.stroke();
                ctx.globalCompositeOperation = 'source-over';
                break;
            case 'line':
                ctx.strokeStyle = data.color;
                ctx.lineWidth = data.lineWidth;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(data.x1, data.y1);
                ctx.lineTo(data.x2, data.y2);
                ctx.stroke();
                break;
            case 'rect':
                ctx.strokeStyle = data.color;
                ctx.lineWidth = data.lineWidth;
                ctx.beginPath();
                ctx.rect(data.x, data.y, data.width, data.height);
                ctx.stroke();
                break;
            case 'circle': {
                const rx = Math.abs(data.width) / 2, ry = Math.abs(data.height) / 2;
                ctx.strokeStyle = data.color;
                ctx.lineWidth = data.lineWidth;
                ctx.beginPath();
                ctx.ellipse(data.x + data.width / 2, data.y + data.height / 2, rx, ry, 0, 0, Math.PI * 2);
                ctx.stroke();
                break;
            }
            case 'text':
                ctx.font = `${data.fontSize ?? 18}px Arial`;
                ctx.fillStyle = data.color;
                ctx.fillText(data.text, data.x, data.y);
                break;
        }
        ctx.restore();
    }, []);
    const redrawFromActions = useCallback((actions) => {
        const ctx = getCtx();
        const canvas = canvasRef.current;
        if (!ctx || !canvas)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        actions.forEach(applyAction);
    }, [applyAction]);
    const emitAction = useCallback((action) => {
        socketRef.current?.emit('board:action', {
            lessonId, pageIndex: PAGE_INDEX,
            action: { type: action.type, data: action.data },
        });
    }, [lessonId]);
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true, auth: { token: tokenManager.get() },
        });
        socketRef.current = socket;
        socket.emit('board:join', { lessonId });
        socket.on('board:fullState', (state) => {
            const actions = (state[PAGE_INDEX] ?? []).map(a => ({ type: a.type, data: a.data }));
            history.current = actions;
            redoStack.current = [];
            redrawFromActions(actions);
        });
        socket.on('board:action', (action) => {
            if (action.userId === userId || action.pageIndex !== PAGE_INDEX)
                return;
            const da = { type: action.type, data: action.data };
            history.current.push(da);
            redoStack.current = []; // чужой action сбрасывает redo
            applyAction(da);
        });
        // Результат board:undo от бэкенда — перерисовываем всех
        socket.on('board:pageState', ({ pageIndex, actions }) => {
            if (pageIndex !== PAGE_INDEX)
                return;
            const drawActions = actions.map(a => ({ type: a.type, data: a.data }));
            history.current = drawActions;
            // redoStack не трогаем — он хранит что можно вернуть
            redrawFromActions(drawActions);
        });
        socket.on('board:pageCleared', ({ pageIndex }) => {
            if (pageIndex !== PAGE_INDEX)
                return;
            history.current = [];
            redoStack.current = [];
            redrawFromActions([]);
        });
        socket.on('board:error', (err) => console.warn('Board:', err.code));
        return () => { socket.disconnect(); };
    }, [lessonId, userId, applyAction, redrawFromActions]);
    const onPointerDown = (e) => {
        drawing.current = true;
        const pos = getPos(e);
        startPos.current = pos;
        points.current = [pos];
        const ctx = getCtx();
        const canvas = canvasRef.current;
        if (ctx && canvas && ['line', 'rect', 'circle'].includes(toolState.tool))
            snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    const onPointerMove = (e) => {
        if (!drawing.current)
            return;
        const pos = getPos(e);
        const ctx = getCtx();
        if (!ctx)
            return;
        const { tool, color, lineWidth } = toolState;
        if (tool === 'brush' || tool === 'erase') {
            points.current.push(pos);
            applyAction({ type: tool, data: { points: points.current.slice(-2), color, lineWidth } });
        }
        if (['line', 'rect', 'circle'].includes(tool)) {
            if (snapshot.current)
                ctx.putImageData(snapshot.current, 0, 0);
            const { x: x1, y: y1 } = startPos.current;
            if (tool === 'line')
                applyAction({ type: 'line', data: { x1, y1, x2: pos.x, y2: pos.y, color, lineWidth } });
            if (tool === 'rect')
                applyAction({ type: 'rect', data: { x: x1, y: y1, width: pos.x - x1, height: pos.y - y1, color, lineWidth } });
            if (tool === 'circle')
                applyAction({ type: 'circle', data: { x: x1, y: y1, width: pos.x - x1, height: pos.y - y1, color, lineWidth } });
        }
    };
    const onPointerUp = (e) => {
        if (!drawing.current)
            return;
        drawing.current = false;
        const pos = getPos(e);
        const { tool, color, lineWidth } = toolState;
        let action = null;
        if (tool === 'brush' || tool === 'erase')
            action = { type: tool, data: { points: [...points.current], color, lineWidth } };
        if (tool === 'line')
            action = { type: 'line', data: { x1: startPos.current.x, y1: startPos.current.y, x2: pos.x, y2: pos.y, color, lineWidth } };
        if (tool === 'rect')
            action = { type: 'rect', data: { x: startPos.current.x, y: startPos.current.y, width: pos.x - startPos.current.x, height: pos.y - startPos.current.y, color, lineWidth } };
        if (tool === 'circle')
            action = { type: 'circle', data: { x: startPos.current.x, y: startPos.current.y, width: pos.x - startPos.current.x, height: pos.y - startPos.current.y, color, lineWidth } };
        if (action) {
            history.current.push(action);
            redoStack.current = [];
            emitAction(action);
        }
        points.current = [];
        snapshot.current = null;
    };
    const onDoubleClick = (e) => {
        if (toolState.tool !== 'text')
            return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        const text = window.prompt('Text eingeben:');
        if (!text)
            return;
        const action = { type: 'text', data: { text, x, y, color: toolState.color, fontSize: 18 } };
        applyAction(action);
        history.current.push(action);
        redoStack.current = [];
        emitAction(action);
    };
    // Undo — синхронизирован через бэкенд
    // Сохраняем в redoStack локально, бэкенд сделает rPop и broadcast board:pageState
    const undo = () => {
        if (!history.current.length)
            return;
        redoStack.current.push(history.current[history.current.length - 1]);
        socketRef.current?.emit('board:undo', { lessonId, pageIndex: PAGE_INDEX });
        // history обновится когда придёт board:pageState
    };
    // Redo — emit как обычный board:action → сохранится в Redis → broadcast
    const redo = () => {
        if (!redoStack.current.length)
            return;
        const next = redoStack.current.pop();
        emitAction(next); // придёт обратно через board:action и попадёт в history
    };
    const save = () => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const link = document.createElement('a');
        link.download = `whiteboard-${lessonId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    const TOOLS = [
        { id: 'brush', label: '🖊' }, { id: 'erase', label: '⬜' },
        { id: 'line', label: '╱' }, { id: 'rect', label: '▭' },
        { id: 'circle', label: '○' }, { id: 'text', label: 'T' },
    ];
    return (_jsxs("div", { className: "flex flex-col h-full bg-gray-900", children: [_jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-700 flex-wrap", children: [TOOLS.map(t => (_jsx("button", { onClick: () => dispatch({ tool: t.id }), title: t.id, className: `w-8 h-8 rounded-lg text-sm font-medium transition flex items-center justify-center
              ${toolState.tool === t.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`, children: t.label }, t.id))), _jsx("div", { className: "w-px h-5 bg-gray-600 mx-0.5" }), _jsx("input", { type: "color", value: toolState.color, onChange: e => dispatch({ color: e.target.value }), className: "w-7 h-7 rounded cursor-pointer border-0 bg-transparent" }), _jsx("input", { type: "range", min: 1, max: 24, value: toolState.lineWidth, onChange: e => dispatch({ lineWidth: Number(e.target.value) }), className: "w-16 accent-blue-500" }), _jsx("div", { className: "w-px h-5 bg-gray-600 mx-0.5" }), _jsx("button", { onClick: undo, title: "R\u00FCckg\u00E4ngig (f\u00FCr alle)", className: "w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition flex items-center justify-center text-sm", children: "\u21A9" }), _jsx("button", { onClick: redo, title: "Wiederholen (f\u00FCr alle)", className: "w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition flex items-center justify-center text-sm", children: "\u21AA" }), _jsx("button", { onClick: save, title: "Als PNG speichern", className: "w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition flex items-center justify-center text-sm ml-auto", children: "\uD83D\uDCBE" })] }), _jsx("canvas", { ref: canvasRef, width: 600, height: 800, onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: onPointerUp, onPointerLeave: onPointerUp, onDoubleClick: onDoubleClick, className: "flex-1 w-full bg-white cursor-crosshair touch-none", style: { imageRendering: 'pixelated' } })] }));
};
