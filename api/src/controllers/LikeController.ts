import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';

export class LikeController {
	constructor(router: Router) {
		router.use('/likes', UserMiddleware.isLogged);
		this.listLike(router);
		this.changeLike(router);
	}

	public async listLike(router: Router) {
		router.get('/likes/:id', async (req: Request, res: Response) => {
			const likes = await DataBase.find('likes', 'post', req.params.id);
			if (likes) {
				res.json({ data: likes });
			} else {
				res.json({ error: 'Erro ao listar likes' });
			}
		});
	}

	public async changeLike(router: Router) {
		router.post('/likes/change/:id', async (req: Request, res: Response) => {
			const data = { ...req.body, post: req.params.id, user: res.getHeader('email') };
			const likes = await DataBase.find('likes', 'post', req.params.id);
			const like = likes.filter((item: any) => item.user == res.getHeader('email'));
			if (like.length > 0) {
				const deleted = await DataBase.delete('likes', like[0].id);
				if (deleted) {
					const likes = await DataBase.find('likes', 'post', req.params.id);
					res.json({ data: likes });
				} else {
					res.json({ error: 'Erro ao criar like' });
				}
			} else {
				const inserted = await DataBase.insert('likes', Date.now().toString(), data);
				if (inserted) {
					const likes = await DataBase.find('likes', 'post', req.params.id);
					res.json({ data: likes });
				} else {
					res.json({ error: 'Erro ao criar like' });
				}
			}
		});
	}
}
