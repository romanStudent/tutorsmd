import { Socket } from 'socket.io';
import { IAccessTokenService } from '../../../application/ports/IAccessTokenService';

export const socketAuthMiddleware = (tokenService: IAccessTokenService) => {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      console.log('=== SOCKET AUTH CHECK START ===');

      /*
      // 1. Получаем токен
      const token = 
        socket.request.headers.cookie?.match(/refreshToken=([^;]+)/)?.[1] ||
        socket.handshake.auth.userToken;
        */
       const token = socket.handshake.auth.accessToken;

      if (!token) {
        console.log('No token found');
        return next(new Error('Unauthorized: No token'));
      }
/*
      // 2. Валидируем токен (через DI)
      const user = tokenService.validateRefreshToken(token);
*/
      const user = tokenService.verifyAccessToken(token);

      if (!user) {
        console.log('Invalid token');
        return next(new Error('Unauthorized: Invalid User'));
      }

      console.log('User verified:', user);

      // 3. Сохраняем данные пользователя в socket
      socket.data.user = {
        id: user.userId,
        activeRole: user.activeRole
      };

      next();
    } catch (err) {
      console.error('Middleware error:', err);
      next(new Error('Authentication error'));
    }
  };
};