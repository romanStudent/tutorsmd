/*
 Обёртка для Websocket обработчиков.
  - Перехватывает любые ошибки и вызывает callback с { ok: false, error }
  - Логирует ошибку с именем события для дебага
  - Не роняет соединение при ошибке бизнес-логики
 */


  import { DomainError }       from '../../../domain/errors/DomainError';
import { NotFoundError }     from '../../../domain/errors/NotFoundError';
import { ForbiddenError }    from '../../../domain/errors/ForbiddenError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { ConflictError }     from '../../../domain/errors/ConflictError';
import { ValidationError }   from '../../../domain/errors/ValidationError';

const toSocketError = (err: unknown): { code: string; message: string } => {
  if (err instanceof ValidationError)   return { code: 'VALIDATION_ERROR',  message: err.message };
  if (err instanceof UnauthorizedError) return { code: 'UNAUTHORIZED',       message: err.message };
  if (err instanceof ForbiddenError)    return { code: 'FORBIDDEN',          message: err.message };
  if (err instanceof NotFoundError)     return { code: 'NOT_FOUND',          message: err.message };
  if (err instanceof ConflictError)     return { code: 'CONFLICT',           message: err.message };
  if (err instanceof DomainError)       return { code: 'DOMAIN_ERROR',       message: err.message };

  // Неизвестная ошибка — не показываем детали клиенту
  console.error('[safeHandler] Unhandled error:', err);
  return { code: 'INTERNAL_ERROR', message: 'Internal server error' };
};

export const safeHandler = <T extends unknown[]>(
  eventName: string,
  handler: (...args: T) => Promise<void>,
) => {
  return async (...args: T): Promise<void> => {
    try {
      await handler(...args);
    } catch (err) {
      console.error(`[socket:${eventName}] Unhandled error:`, err);
 
      // Если последний аргумент — callback (acknowledgement), сообщаем об ошибке клиенту.
      // Это не обязательно, но помогает не зависать на клиенте в ожидании ответа.
      const lastArg = args[args.length - 1];
      if (typeof lastArg === "function") {
        try {
          (lastArg as Function)({ ok: false, error: "Internal server error" });
        } catch {
          // callback уже мог быть вызван внутри handler до ошибки — игнорируем
        }
      }
    }
  };
};