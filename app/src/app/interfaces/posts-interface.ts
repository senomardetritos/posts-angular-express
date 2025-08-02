export interface PostInterface {
  id: string;
  user: string;
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
