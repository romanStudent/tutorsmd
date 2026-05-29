import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId, selectActiveRole } from '@entities/user/model/selectors';
import { tokenManager } from '@shared/lib/TokenManager';
import { io } from 'socket.io-client';
export const VideoRoom = ({ lessonId, localStream, setLocalStream, remoteStreams, setRemoteStreams, canJoin, }) => {
    const userId = useSelector(selectUserId);
    const activeRole = useSelector(selectActiveRole);
    const localRef = useRef(null);
    const socketRef = useRef(null);
    const peersRef = useRef(new Map());
    const [participants, setParticipants] = useState([]);
    const [tutorPresent, setTutorPresent] = useState(false);
    // ───────────── MEDIA ─────────────
    useEffect(() => {
        if (!canJoin)
            return;
        let stream;
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((s) => {
            stream = s;
            setLocalStream(s);
            if (localRef.current)
                localRef.current.srcObject = s;
        })
            .catch(console.error);
        return () => {
            stream?.getTracks().forEach((t) => t.stop());
            setLocalStream(null);
        };
    }, [canJoin]);
    // ───────────── SOCKET + WEBRTC ─────────────
    useEffect(() => {
        if (!canJoin || !localStream || !userId)
            return;
        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            auth: { token: tokenManager.get() },
        });
        socketRef.current = socket;
        socket.emit('joinLesson', { lessonId });
        // ─── Participants ───
        socket.on('updateParticipants', async (list) => {
            setParticipants(list);
            for (const peerId of list) {
                if (peerId === socket.id)
                    continue;
                if (peersRef.current.has(peerId))
                    continue;
                const pc = createPeerConnection(peerId, socket);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('lesson:offer', { to: peerId, offer });
            }
        });
        socket.on('tutorJoined', () => setTutorPresent(true));
        // ─── SIGNALING ───
        socket.on('lesson:offer', async ({ from, offer }) => {
            if (peersRef.current.has(from))
                return;
            const pc = createPeerConnection(from, socket);
            await pc.setRemoteDescription(offer);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('lesson:answer', { to: from, answer });
        });
        socket.on('lesson:answer', async ({ from, answer }) => {
            await peersRef.current.get(from)?.setRemoteDescription(answer);
        });
        socket.on('lesson:ice-candidate', async ({ from, candidate }) => {
            await peersRef.current.get(from)?.addIceCandidate(candidate);
        });
        socket.on('lesson:user-left', (peerId) => {
            peersRef.current.get(peerId)?.close();
            peersRef.current.delete(peerId);
            setRemoteStreams((prev) => {
                const m = new Map(prev);
                m.delete(peerId);
                return m;
            });
        });
        socket.on('meetingEnded', () => {
            localStream.getTracks().forEach((t) => t.stop());
        });
        return () => {
            socket.emit('leaveLesson', { lessonId });
            socket.disconnect();
            peersRef.current.forEach((pc) => pc.close());
            peersRef.current.clear();
            setRemoteStreams(new Map());
        };
    }, [canJoin, localStream, userId, lessonId]);
    // ───────────── PEER ─────────────
    const createPeerConnection = (peerId, socket) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        localStream?.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit('lesson:ice-candidate', {
                    to: peerId,
                    candidate: e.candidate,
                });
            }
        };
        pc.ontrack = (e) => {
            setRemoteStreams((prev) => {
                const m = new Map(prev);
                m.set(peerId, e.streams[0]);
                return m;
            });
        };
        peersRef.current.set(peerId, pc);
        return pc;
    };
    // ───────────── GRID ─────────────
    const remoteEntries = Array.from(remoteStreams.entries());
    const totalVideos = 1 + remoteEntries.length;
    const cols = totalVideos <= 1 ? 1 : totalVideos <= 4 ? 2 : 3;
    // ───────────── UI ─────────────
    return (_jsxs("div", { className: "flex-1 grid gap-2 p-2 bg-gray-900", style: { gridTemplateColumns: `repeat(${cols}, 1fr)` }, children: [_jsxs("div", { className: "relative bg-gray-800 rounded-xl overflow-hidden aspect-video", children: [_jsx("video", { ref: localRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-full object-cover" }), _jsxs("span", { className: "absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded", children: ["Sie ", activeRole === 'tutor'
                                ? '(Lehrer)'
                                : activeRole === 'admin'
                                    ? '(Admin)'
                                    : '(Schüler)'] }), _jsxs("span", { className: "absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded", children: [participants.length, " online"] }), participants.length === 1 && (_jsx("span", { className: "absolute top-2 left-2 text-xs text-yellow-400", children: "Waiting for others..." })), activeRole === 'client' && !tutorPresent && (_jsx("span", { className: "absolute top-6 left-2 text-xs text-red-400", children: "Tutor not joined" }))] }), remoteEntries.map(([peerId, stream]) => (_jsx(RemoteVideo, { peerId: peerId, stream: stream }, peerId))), !canJoin && (_jsx("div", { className: "col-span-full flex items-center justify-center", children: _jsx("p", { className: "text-gray-400 text-sm", children: "Der Unterricht hat noch nicht begonnen." }) }))] }));
};
// ───────────── Remote ─────────────
const RemoteVideo = ({ stream, peerId }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current)
            ref.current.srcObject = stream;
    }, [stream]);
    return (_jsxs("div", { className: "relative bg-gray-800 rounded-xl overflow-hidden aspect-video", children: [_jsx("video", { ref: ref, autoPlay: true, playsInline: true, className: "w-full h-full object-cover" }), _jsx("span", { className: "absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded", children: peerId.slice(0, 8) })] }));
};
