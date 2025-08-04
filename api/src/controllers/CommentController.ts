import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';

export class CommentController {
	constructor(router: Router) {
		router.use('/comments', UserMiddleware.isLogged);
		this.listComment(router);
		this.addComment(router);
	}

	public async listComment(router: Router) {
		router.get('/comments/:id', async (req: Request, res: Response) => {
			const likes = await DataBase.find('comments', 'post', req.params.id);
			if (likes) {
				res.json({ data: likes });
			} else {
				res.json({ error: 'Erro ao listar comments' });
			}
		});
	}

	public async addComment(router: Router) {
		router.post('/comments/add/:id', async (req: Request, res: Response) => {
			const data = { ...req.body, post: req.params.id, user: res.getHeader('email') };
			const inserted = await DataBase.insert('comments', Date.now().toString(), data);
			if (inserted) {
				const comments = await DataBase.find('comments', 'post', req.params.id);
				res.json({ data: comments });
			} else {
				res.json({ error: 'Erro ao criar comments' });
			}
		});
	}
}
