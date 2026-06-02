import { EventEmitter } from 'events';

export const AppEvents = {
  LESSON_COMPLETED:   'lesson:completed',
  SESSION_REVOKED:    'session:revoked',    
} as const;

export type AppEventMap = {
  [AppEvents.LESSON_COMPLETED]: [lessonId: string];
  [AppEvents.SESSION_REVOKED]:  [userId: string];  
};

class TypedEventEmitter extends EventEmitter {
  emit<K extends keyof AppEventMap>(event: K, ...args: AppEventMap[K]): boolean {
    return super.emit(event, ...args);
  }
  on<K extends keyof AppEventMap>(event: K, listener: (...args: AppEventMap[K]) => void): this {
    return super.on(event, listener);
  }
}

export const appEvents = new TypedEventEmitter();