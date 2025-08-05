import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { UserInterface } from '../interfaces/user-interface';
import { CommentInterface } from '../interfaces/comment-interface';

export class CommentController {
	constructor(router: Router) {
		router.use('/comments', UserMiddleware.isLogged);
		this.listComment(router);
		this.addComment(router);
	}

	private async listComment(router: Router) {
		router.get('/comments/:id', async (req: Request, res: Response) => {
			const comments = await this.commentsWithUser(req.params.id);
			if (comments) {
				res.json({ data: comments });
			} else {
				res.json({ error: 'Erro ao listar comments' });
			}
		});
	}

	private async addComment(router: Router) {
		router.post('/comments/add/:id', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const data = { ...req.body, post_id: req.params.id, user_id: user.id };
			const inserted = await DataBase.insert('comments', data);
			if (inserted) {
				const comments = await this.commentsWithUser(req.params.id);
				res.json({ data: comments });
			} else {
				res.json({ error: 'Erro ao criar comments' });
			}
		});
	}

	private async commentsWithUser(post_id: string) {
		const comments = (await DataBase.find('comments', 'post_id', post_id)) as CommentInterface[];
		const new_comments: CommentInterface[] = [];
		for (const item of comments) {
			const user = await DataBase.get('users', item.user_id);
			new_comments.push({ ...item, user });
		}
		return new_comments;
	}
}
