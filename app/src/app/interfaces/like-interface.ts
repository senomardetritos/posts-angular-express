export interface LikeInterface {
  id: string;
  post: string;
  user: string;
  date: Date;
}

export interface LikesResponseInterface {
  data: LikeInterface[];
  error: string;
}
