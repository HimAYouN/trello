// auth.types.ts

// what you encode into the JWT payload
export interface JwtPayload {
  userId: number;
}

// shape returned after a successful login
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// safe user shape to send back to the client (never include password)
export interface SafeUser {
  id: number;
  email: string;
  name: string | null;
}

// full login response
export interface LoginResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

// extends Express's Request type so req.user is typed after auth.middleware runs
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// a small custom error class
export class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

// re-export nothing needed here since the above is a global augmentation,
// but this export {} keeps the file treated as a module rather than a script
export {};