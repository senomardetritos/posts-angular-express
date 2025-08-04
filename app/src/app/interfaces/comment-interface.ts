export interface CommentInterface {
  id: string;
  post: string;
  user: string;
  date: Date;
  comment: string;
}

export interface CommentsResponseInterface {
  data: CommentInterface[];
  error: string;
}
