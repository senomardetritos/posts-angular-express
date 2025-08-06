import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import * as jwt from 'jsonwebtoken';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { UserInterface } from '../interfaces/user-interface';
import multer from 'multer';
import { readFileSync } from 'fs';

export class UserController {
	constructor(router: Router) {
		router.use('/users', UserMiddleware.isLogged);
		this.register(router);
		this.login(router);
		this.getUser(router);
		this.updateUser(router);
		this.changePassword(router);
		this.uploadPhoto(router);
		this.photoUser(router);
		this.checkdb(router);
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
								id: user[0].id,
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

	private async uploadPhoto(router: Router) {
		const storage = multer.memoryStorage(); // Stores the file in memory as a Buffer
		const upload = multer({ storage: storage });
		// const upload = multer({ dest: 'uploads/' });
		router.post('/users/upload', upload.single('photo'), async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			if (user.email == 'teste@email.com') {
				res.json({ error: 'Usuário de teste não pode ser alterado' });
				return;
			}
			if (req.file) {
				DataBase.query('update users set photo = ? where id = ?', [req.file.buffer, user.id]);
				res.json({ data: true });
			} else {
				res.json({ error: 'Arquivo não passado para a requisição' });
			}
		});
	}

	private async photoUser(router: Router) {
		router.get('/user-photo/:id', async (req: Request, res: Response) => {
			const user = await DataBase.get('users', req.params.id);
			if (user && user.photo && user.photo.toString().trim() != '') {
				const imageData = user.photo;
				const contentType = user.content_type || 'application/octet-stream'; // Default if not specified
				res.setHeader('Content-Type', contentType);
				res.send(imageData); // Send the buffer directly
			} else {
				const fs = readFileSync('public/images/no-photo-user.jpg');
				const imageData = fs;
				const contentType = 'application/octet-stream'; // Default if not specified
				res.setHeader('Content-Type', contentType);
				res.send(imageData); // Send the buffer directly
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
