export interface UserInterface {
  id: number;
  email: string;
  name: string;
}

export interface LoginInterface {
  id: string;
  email: string;
  password: string;
}

export interface LoginResponseInterface {
  data: {
    id: string;
    email: string;
    name: string;
    token: string;
  };
  error: string;
}

export interface RegisterInterface {
  email: string;
  name: string;
  password: string;
}

export interface ProfileInterface {
  name: string;
}

export interface ProfileResponseInterface {
  data: {
    name: string;
  };
  error: string;
}

export interface ChangePasswordInterface {
  actual_password: string;
  new_password: string;
}

export interface UserPhotoInterface {
  photo: File;
}
