import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRefreshMutation } from '@shared/api/authApi';
import { setCredentials, clearCredentials } from '@entities/user/model/authSlice';
import { tokenManager } from '@shared/lib/TokenManager';
import { jwtDecode } from 'jwt-decode';
import type { Role } from '@entities/user/model/types';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '@entities/user/model/selectors';
import { io } from 'socket.io-client';

interface JwtPayload {
  userId:     string;
  activeRole: Role;
  exp:        number;
}

export const useInitAuth = () => {
  const dispatch  = useDispatch();
  const [refresh] = useRefreshMutation();
  const [isReady, setIsReady] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);


  useEffect(() => {
    const init = async () => {
      try {
        const data = await refresh({}).unwrap();
        tokenManager.set(data.accessToken);

        const payload = jwtDecode<JwtPayload>(data.accessToken);
        dispatch(setCredentials({
          userId:     payload.userId,
          activeRole: payload.activeRole,
        }));
      } catch {
        // Нет валидного refreshToken - не залогинен
        tokenManager.clear();
        dispatch(clearCredentials());
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []); 

   // Если другое устройство отозвало мою сессию -> мгновенно разлогиниваем
  useEffect(() => {
    if (!isAuthenticated) return;
 
    const token = tokenManager.get();
    if (!token) return;
 
    const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
      withCredentials: true,
      auth: { token },
    });
 
    socket.on('session:revoked', () => {
      tokenManager.clear();
      dispatch(clearCredentials());
      navigate('/login');
      socket.disconnect();
    });
 
    // auth:expired - access token истёк, пытаемся refresh
    socket.on('auth:expired', async () => {
      try {
        const data = await refresh({}).unwrap();
        tokenManager.set(data.accessToken);
      } catch {
        tokenManager.clear();
        dispatch(clearCredentials());
        navigate('/login');
      }
      socket.disconnect();
    });
 
    return () => { socket.disconnect(); };
  }, [isAuthenticated]); 
 


  return { isReady };
};