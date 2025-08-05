import { UserInterface } from './user-interface';

export interface PostInterface {
	id: number;
	user_id: number;
	title: string;
	text: string;
	date: Date;
	user: UserInterface;
}
