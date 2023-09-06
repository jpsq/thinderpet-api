/* MODELS TYPES */
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone: number;
  photo: Object;
  localization: Object;
  latitud: number;
  longitud: number;
}

/* USER RESPONSE TYPE */
