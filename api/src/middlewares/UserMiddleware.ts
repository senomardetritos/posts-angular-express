import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { DataBase } from '../models/DataBase';
import { UserInterface } from '../interfaces/user-interface';

export class UserMiddleware {
	public static async isLogged(req: Request, res: Response, next: NextFunction) {
		const token = req.headers.authorization?.split(' ')[1] ?? '';
		const privateKey = process.env.API_KEY || '';
		const email = jwt.verify(token, privateKey);
		const user = (await DataBase.find('users', 'email', email as string)) || ([] as UserInterface[]);
		if (user && user[0] && user[0].email) {
			res.setHeader('email', email.toString());
			const data_user = Object.assign({}, user[0]);
			delete data_user.password;
			res.setHeader('user', data_user);
			next();
		} else {
			res.status(400).json({ error: 'Não autorizado' });
		}
	}
}
