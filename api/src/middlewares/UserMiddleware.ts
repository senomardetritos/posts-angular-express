import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { DataBase } from '../models/DataBase';
import { EnvUtil } from '../utils/EnvUtil';

export class UserMiddleware {
	public static async isLogged(req: Request, res: Response, next: NextFunction) {
		const token = req.headers.authorization?.split(' ')[1] ?? '';
		const privateKey = EnvUtil.getEnv('API_KEY');
		const email = jwt.verify(token, privateKey);
		const user = await DataBase.get('users', `${email}`);
		if (user && user.email) {
			res.setHeader('email', email.toString());
			next();
		} else {
			res.status(400).json({ error: 'Não autorizado' });
		}
	}
}
