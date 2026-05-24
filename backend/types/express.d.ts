declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        activeRole: 'client' | 'tutor' | 'admin';
      };
    }
  }
}

export {};