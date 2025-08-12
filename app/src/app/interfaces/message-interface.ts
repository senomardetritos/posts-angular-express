export interface MessageInterface {
  id: number;
  user_id: number;
  name: string;
  message: string;
  date: Date;
}

export interface UserMessageInterface {
  id: number;
  email: string;
  name: string;
  message: string;
  date: Date;
}

export interface UserMessageResponseInterface {
  data: UserMessageInterface;
  error: string;
}

export interface UsersMessageResponseInterface {
  data: UserMessageInterface[];
  error: string;
}

export interface MessagesResponseInterface {
  data: MessageInterface[];
  error: string;
}
