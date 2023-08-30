import { type AxiosInstance } from "axios";

declare global {
  namespace Express {
    interface Request {
      vet: VetDoc;
      instance?: AxiosInstance;
    }
  }
}
