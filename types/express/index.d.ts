import { TUser } from "../../server/models/user.model";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      kindeUser: {
        sub: string;
        email: string;
      } | null;
      user: TUser | null;
    }
  }
}
