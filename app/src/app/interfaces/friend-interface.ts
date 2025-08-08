import { PostInterface } from "./posts-interface";
import { UserInterface } from "./users-interface";

export interface FriendInterface {
  user: UserInterface;
  following: UserInterface[];
  followers: UserInterface[];
  posts: PostInterface[];
}

export interface FriendResponseInterface {
  data: FriendInterface;
  error: string;
}

export interface FollowResponseInterface {
  data: boolean;
}
