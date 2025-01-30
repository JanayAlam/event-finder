import { Outlet, User } from "@prisma/client";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User & {
        outlet?: Outlet | null;
      };
      file?: Express.Multer.File;
      files?: any;
    }
  }
}
