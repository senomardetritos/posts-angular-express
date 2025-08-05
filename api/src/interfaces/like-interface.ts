import { UserInterface } from './user-interface';

export interface LikeInterface {
	id: string;
	post_id: string;
	user_id: string;
	date: Date;
	user: UserInterface;
}
