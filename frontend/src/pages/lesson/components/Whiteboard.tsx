
import { useEffect, useRef, useReducer, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '@entities/user/model/selectors';
import { tokenManager } from '@shared/lib/TokenManager';
import { io, Socket } from 'socket.io-client';

type Tool = 'brush' | 'erase';
type Action = { type: string; data: any };

interface State {
  tool:      Tool;
  color:     string;
  lineWidth: number;
}

const initialState: State = { tool: 'brush', color: '#ffffff', lineWidth: 3 };

const reducer = (state: State, action: Partial<State>) => ({ ...state, ...action });

export const Whiteboard = ({ lessonId }: { lessonId: string }) => {
  const userId    = useSelector(selectUserId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const drawing   = useRef(false);
  const points    = useRef<{ x: number; y: number }[]>([]);
  const history   = useRef<Action[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
      withCredentials: true,
      auth: { token: tokenManager.get() },
    });
    socketRef.current = socket;

    socket.emit('board:join', { lessonId });

    socket.on('board:action', (action: Action & { userId: string }) => {
      if (action.userId === userId) return;
      history.current.push(action);
      applyAction(action);
    });

    socket.on('board:fullState', (actions: Action[]) => {
      history.current = actions;
      redraw();
    });

    return () => { socket.disconnect(); };
  }, [lessonId, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCtx = () => canvasRef.current?.getContext('2d') ?? null;

  const applyAction = useCallback((action: Action) => {
    const ctx = getCtx();
    if (!ctx) return;
    if (action.type === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = action.data.color;
      ctx.lineWidth   = action.data.lineWidth;
      ctx.beginPath();
      action.data.points.forEach((p: any, i: number) => {
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
    if (action.type === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = action.data.lineWidth;
      ctx.beginPath();
      action.data.points.forEach((p: any, i: number) => {
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
  }, []);

  const redraw = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    history.current.forEach(applyAction);
  }, [applyAction]);

  const getPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drawing.current = true;
    points.current  = [getPos(e)];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    points.current.push(getPos(e));
    const action: Action = {
      type: state.tool,
      data: { points: [...points.current], color: state.color, lineWidth: state.lineWidth },
    };
    applyAction(action);
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const action: Action = {
      type: state.tool,
      data: { points: [...points.current], color: state.color, lineWidth: state.lineWidth },
    };
    history.current.push(action);
    socketRef.current?.emit('board:action', { lessonId, ...action, userId });
    points.current = [];
  };

  const undo = () => {
    history.current.pop();
    redraw();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700">
        <button
          onClick={() => dispatch({ tool: 'brush' })}
          className={`p-1.5 rounded-lg text-sm transition
            ${state.tool === 'brush' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
          🖊
        </button>
        <button
          onClick={() => dispatch({ tool: 'erase' })}
          className={`p-1.5 rounded-lg text-sm transition
            ${state.tool === 'erase' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
          ⬜
        </button>
        <input
          type="color"
          value={state.color}
          onChange={(e) => dispatch({ color: e.target.value })}
          className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
        />
        <input
          type="range"
          min={1} max={20}
          value={state.lineWidth}
          onChange={(e) => dispatch({ lineWidth: Number(e.target.value) })}
          className="w-16"
        />
        <button onClick={undo} className="text-gray-400 hover:text-white text-sm ml-auto">
          ↩ Undo
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={280}
        height={400}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex-1 w-full bg-gray-900 cursor-crosshair touch-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};