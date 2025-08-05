import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import * as jwt from 'jsonwebtoken';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { UserInterface } from '../interfaces/user-interface';

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

	private async getUser(router: Router) {
		router.get('/users/get', async (req: Request, res: Response) => {
			res.json({ data: res.getHeader('user') });
		});
	}

	private async updateUser(router: Router) {
		router.post('/users/update', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			if (user.email == 'teste@email.com') {
				res.json({ error: 'Usuário de teste não pode ser alterado' });
				return;
			}
			const updated = await DataBase.update('users', user.id.toString(), req.body);
			if (updated) {
				res.json({ data: true });
			} else {
				res.json({ error: 'Erro ao atualizar perfil' });
			}
		});
	}

	private async changePassword(router: Router) {
		router.post('/users/change-password', async (req: Request, res: Response) => {
			const user = (await DataBase.find('users', 'email', res.getHeader('email') as string)) || ([] as UserInterface[]);
			if (user && user[0] && user[0].email) {
				if (user[0].email == 'teste@email.com') {
					res.json({ error: 'Usuário de teste não pode ser alterado' });
					return;
				}
				const privateKey = process.env.API_KEY || '';
				const password = jwt.verify(user[0].password, privateKey);
				if (password == req.body.actual_password) {
					const new_data = {
						password: jwt.sign(req.body.new_password, privateKey),
					};
					const updated = await DataBase.update('users', user[0].id as string, new_data);
					if (updated) {
						res.json({ data: true });
					} else {
						res.json({ error: 'Erro ao atualizar senha' });
					}
				} else {
					res.json({ error: 'Senha atual incorreta' });
				}
			} else {
				res.json({ error: 'Usuário não encontrado' });
			}
		});
	}

	private async register(router: Router) {
		router.post('/register', async (req: Request, res: Response) => {
			const user = (await DataBase.find('users', 'email', `${req.body.email}`)) || ([] as UserInterface[]);
			if (user && user[0] && user[0].email) {
				res.json({ error: 'Usuário já cadastrado!' });
			} else {
				const privateKey = process.env.API_KEY || '';
				req.body.password = jwt.sign(req.body.password, privateKey);
				const data_user = await DataBase.insert('users', req.body);
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

	private async login(router: Router) {
		router.post('/login', async (req: Request, res: Response) => {
			const user = (await DataBase.find('users', 'email', `${req.body.email}`)) || ([] as UserInterface[]);
			if (user && user[0] && user[0].email) {
				const privateKey = process.env.API_KEY || '';
				try {
					const password = jwt.verify(user[0].password, privateKey);
					if (password == req.body.password) {
						const token = jwt.sign(user[0].email, privateKey);
						res.json({
							data: {
								email: user[0].email,
								name: user[0].name,
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

	private async checkdb(router: Router) {
		router.get('/checkdb', async (req: Request, res: Response) => {
			const users = (await DataBase.all('users')) as UserInterface[];
			const emails: any[] = [];
			users.map((item: any) => {
				emails.push(item.email);
			});

			res.json({ emails });
		});
	}
}
