/* MODELS TYPES */
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone: number;
  image?: {
    secure_url: string;
    public_id: string;
  };
  localization: Object;
}

/* USER RESPONSE TYPE */
