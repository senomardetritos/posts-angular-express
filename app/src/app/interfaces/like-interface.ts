import { UserInterface } from "./users-interface";

export interface LikeInterface {
  id: string;
  post: string;
  user: UserInterface;
  date: Date;
}

export interface LikesResponseInterface {
  data: LikeInterface[];
  error: string;
}
