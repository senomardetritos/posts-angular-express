import { UserInterface } from "./users-interface";

export interface PostInterface {
  id: string;
  user: UserInterface;
  title: string;
  text: string;
  date: Date;
}

export interface PostResponseInterface {
  data: PostInterface;
  error: string;
}

export interface PostsResponseInterface {
  data: PostInterface[];
  error: string;
}
