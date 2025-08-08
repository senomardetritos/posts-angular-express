import { PostInterface } from './post-interface';
import { UserInterface } from './user-interface';

export interface FriendInterface {
	user: UserInterface;
	following: UserInterface[];
	followers: UserInterface[];
	posts: PostInterface[];
}
