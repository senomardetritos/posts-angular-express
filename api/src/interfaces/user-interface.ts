export interface UserInterface {
	id: number;
	email: string;
	password: string;
	name: string;
	date: Date;
}

export interface OTPInterface {
	id: number;
	user_id: number;
	otp: number;
	date: Date;
}
