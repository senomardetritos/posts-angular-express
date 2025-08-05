import { UserInterface } from "./users-interface";

export interface CommentInterface {
  id: string;
  post: string;
  user: UserInterface;
  date: Date;
  comment: string;
}

export interface CommentsResponseInterface {
  data: CommentInterface[];
  error: string;
}
