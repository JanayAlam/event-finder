import { IUserDoc } from "../../server/models/User";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      kindeUser: {
        sub: string;
        email: string;
      } | null;
      user: IUserDoc | null;
    }
  }
}
