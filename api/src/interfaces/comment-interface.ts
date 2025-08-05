import { UserInterface } from './user-interface';

export interface CommentInterface {
	id: string;
	post_id: string;
	user_id: string;
	date: Date;
	comment: string;
	user: UserInterface;
}
