import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import * as jwt from 'jsonwebtoken';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { EnvUtil } from '../utils/EnvUtil';

export class UserController {
	constructor(router: Router) {
		router.use('/users', UserMiddleware.isLogged);
		this.getUser(router);
		this.updateUser(router);
		this.changePassword(router);
		this.register(router);
		this.login(router);
		this.checkdb(router);
	}

	public async getUser(router: Router) {
		router.get('/users/get', async (req: Request, res: Response) => {
			const user = await DataBase.get('users', `${res.getHeader('email')}`);
			if (user) {
				const data_user = Object.assign({}, user);
				delete data_user.password;
				res.json({ data: data_user });
			} else {
				res.json({ error: 'Usuário não encontrado' });
			}
		});
	}

	public async updateUser(router: Router) {
		router.post('/users/update', async (req: Request, res: Response) => {
			const user = await DataBase.update('users', `${res.getHeader('email')}`, req.body);
			if (user) {
				res.json({ data: user });
			} else {
				res.json({ error: 'Erro ao atualizar perfil' });
			}
		});
	}

	public async changePassword(router: Router) {
		router.post('/users/change-password', async (req: Request, res: Response) => {
			const user = await DataBase.get('users', `${res.getHeader('email')}`);
			const privateKey = EnvUtil.getEnv('API_KEY');
			const password = jwt.verify(user.password, privateKey);
			if (password == req.body.actual_password) {
				const new_data = {
					password: jwt.sign(req.body.new_password, privateKey),
				};
				const user = await DataBase.update('users', `${res.getHeader('email')}`, new_data);
				if (user) {
					res.json({ data: user });
				} else {
					res.json({ error: 'Erro ao atualizar senha' });
				}
			} else {
				res.json({ error: 'Senha atual incorreta' });
			}
		});
	}

	public async register(router: Router) {
		router.post('/register', async (req: Request, res: Response) => {
			const user = await DataBase.get('users', `${req.body.email}`);
			if (user && user.email) {
				res.json({ error: 'Usuário já cadastrado!' });
			} else {
				const privateKey = EnvUtil.getEnv('API_KEY');
				req.body.password = jwt.sign(req.body.password, privateKey);
				const data_user = await DataBase.insert('users', `${req.body.email}`, req.body);
				if (data_user) {
					const { email, name } = req.body;
					const token = jwt.sign(email, privateKey);
					res.json({
						data: {
							email: email,
							name: name,
							token: token,
						},
					});
				} else {
					res.json({ error: 'Erro ao cadastrar' });
				}
			}
		});
	}

	public async login(router: Router) {
		router.post('/login', async (req: Request, res: Response) => {
			const user = await DataBase.get('users', `${req.body.email}`);
			if (user && user.email) {
				const privateKey = EnvUtil.getEnv('API_KEY');
				try {
					const password = jwt.verify(user.password, privateKey);
					if (password == req.body.password) {
						const token = jwt.sign(user.email, privateKey);
						res.json({
							data: {
								email: user.email,
								name: user.name,
								token: token,
							},
						});
					} else {
						res.json({ error: 'Senha incorreta!' });
					}
				} catch (e: any) {
					res.json({ error: e.message });
				}
			} else {
				res.json({ error: 'Usuário não encontrado!' });
			}
		});
	}

	public async checkdb(router: Router) {
		router.get('/checkdb', async (req: Request, res: Response) => {
			const users = await DataBase.all('users');
			const emails: any[] = [];
			users.map((item: any) => {
				emails.push(item.email);
			});
			res.json({ emails });
		});
	}
}
