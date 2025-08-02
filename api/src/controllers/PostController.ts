import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';

export class PostController {
	constructor(router: Router) {
		router.use('/posts', UserMiddleware.isLogged);
		this.listPost(router);
		this.getPost(router);
		this.insertPost(router);
		this.updatePost(router);
	}

	public async listPost(router: Router) {
		router.get('/posts', async (req: Request, res: Response) => {
			const posts = await DataBase.find('posts', 'user', res.getHeader('email') as string);
			if (posts) {
				res.json({ data: posts });
			} else {
				res.json({ error: 'Erro ao listar post' });
			}
		});
	}

	public async getPost(router: Router) {
		router.get('/posts/:id', async (req: Request, res: Response) => {
			const post = await DataBase.get('posts', req.params.id);
			if (post) {
				if (post.user == res.getHeader('email')) {
					res.json({ data: post });
				} else {
					res.json({ error: 'Post não pertence a esse usuário' });
				}
			} else {
				res.json({ error: 'Erro ao listar post' });
			}
		});
	}

	public async insertPost(router: Router) {
		router.post('/posts/add', async (req: Request, res: Response) => {
			const data = { user: res.getHeader('email'), ...req.body };
			const post = await DataBase.insert('posts', Date.now().toString(), data);
			if (post) {
				res.json({ data: post });
			} else {
				res.json({ error: 'Erro ao criar post' });
			}
		});
	}

	public async updatePost(router: Router) {
		router.post('/posts/update/:id', async (req: Request, res: Response) => {
			const post = await DataBase.get('posts', req.params.id);
			if (post) {
				if (post.user == res.getHeader('email')) {
					const data = { user: res.getHeader('email'), ...req.body };
					const updated = await DataBase.update('posts', req.params.id, data);
					if (updated) {
						res.json({ data: updated });
					} else {
						res.json({ error: 'Erro ao criar post' });
					}
				} else {
					res.json({ error: 'Post não pertence a esse usuário' });
				}
			} else {
				res.json({ error: 'Post não encontrado' });
			}
		});
	}
}
