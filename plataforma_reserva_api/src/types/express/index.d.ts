import { Role } from "../../middlewares/authorize";

declare global {
  namespace Express {
    interface Request {
      user?: {
        role: Role;
        permissions: string[];
        sub: string;
      };
    }
  }
}
