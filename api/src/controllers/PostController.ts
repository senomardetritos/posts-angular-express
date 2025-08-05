import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { UserInterface } from '../interfaces/user-interface';
import { PostInterface } from '../interfaces/post-interface';

export class PostController {
	constructor(router: Router) {
		router.use('/posts', UserMiddleware.isLogged);
		this.listPost(router);
		this.lastsPost(router);
		this.searchPost(router);
		this.getPost(router);
		this.insertPost(router);
		this.updatePost(router);
	}

	private async listPost(router: Router) {
		router.get('/posts', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const posts = await DataBase.find('posts', 'user_id', user.id.toString());
			if (posts) {
				res.json({ data: posts });
			} else {
				res.json({ error: 'Erro ao listar post' });
			}
		});
	}

	private async lastsPost(router: Router) {
		router.get('/posts/lasts', async (req: Request, res: Response) => {
			const posts = (await DataBase.last('posts', 10)) as PostInterface[];
			const new_posts: PostInterface[] = [];
			for (const post of posts) {
				const user = await DataBase.get('users', post.user_id.toString());
				new_posts.push({ ...post, user });
			}
			if (new_posts) {
				res.json({ data: new_posts });
			} else {
				res.json({ error: 'Erro ao listar post' });
			}
		});
	}

	private async searchPost(router: Router) {
		router.get('/posts/search/:search', async (req: Request, res: Response) => {
			const data = {
				title: req.params.search,
				text: req.params.search,
			};
			const posts = (await DataBase.like('posts', data)) as PostInterface[];
			const new_posts: PostInterface[] = [];
			for (const post of posts) {
				const user = await DataBase.get('users', post.user_id.toString());
				new_posts.push({ ...post, user });
			}
			if (new_posts) {
				res.json({ data: new_posts });
			} else {
				res.json({ error: 'Erro ao listar post' });
			}
		});
	}

	private async getPost(router: Router) {
		router.get('/posts/:id', async (req: Request, res: Response) => {
			const post = (await DataBase.get('posts', req.params.id)) as PostInterface;
			const user = (res.getHeader('user') || {}) as UserInterface;
			if (post) {
				if (post.user_id == user.id) {
					res.json({ data: post });
				} else {
					res.json({ error: 'Post não pertence a esse usuário' });
				}
			} else {
				res.json({ error: 'Erro ao listar post' });
			}
		});
	}

	private async insertPost(router: Router) {
		router.post('/posts/add', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			delete req.body.id;
			const data = { ...req.body, user_id: user.id };
			const post = await DataBase.insert('posts', data);
			if (post) {
				res.json({ data: post });
			} else {
				res.json({ error: 'Erro ao criar post' });
			}
		});
	}

	private async updatePost(router: Router) {
		router.post('/posts/update/:id', async (req: Request, res: Response) => {
			const post = (await DataBase.get('posts', req.params.id)) as PostInterface;
			const user = (res.getHeader('user') || {}) as UserInterface;
			if (post) {
				if (post.user_id == user.id) {
					delete req.body.id;
					delete req.body.user_id;
					delete req.body.date;
					const updated = await DataBase.update('posts', req.params.id, req.body);
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
