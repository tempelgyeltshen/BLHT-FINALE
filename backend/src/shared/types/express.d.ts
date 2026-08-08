/**
 * Ambient Express type augmentation.
 *
 * The `requireAdmin` middleware attaches the authenticated admin to
 * `req.user`, so we widen Express's Request interface here so controllers
 * can read it without casting.
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'admin';
      };
    }
  }
}

export {};
