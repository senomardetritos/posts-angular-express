import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { UserInterface } from '../interfaces/user-interface';
import { CommentInterface } from '../interfaces/comment-interface';
import { PostInterface } from '../interfaces/post-interface';
import { TemplateUtil } from '../utils/template-util';
import { MailerController } from './MailerController';

export class CommentController {
	constructor(router: Router) {
		router.use('/comments', UserMiddleware.isLogged);
		this.listComment(router);
		this.addComment(router);
		this.deleteComment(router);
	}

	private async listComment(router: Router) {
		router.get('/comments/:id', async (req: Request, res: Response) => {
			const comments = await this.commentsWithUser(req.params.id);
			if (comments) {
				res.json({ data: comments });
			} else {
				res.json({ error: 'Erro ao listar Comentário' });
			}
		});
	}

	private async addComment(router: Router) {
		router.post('/comments/add/:id', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const data = { ...req.body, post_id: req.params.id, user_id: user.id };
			const post = (await DataBase.get('posts', req.params.id)) as PostInterface;
			const post_user = (await DataBase.get('users', post.user_id.toString())) as UserInterface;
			const inserted = await DataBase.insert('comments', data);
			if (inserted) {
				const comments = await this.commentsWithUser(req.params.id);
				MailerController.sendEmail({
					to: post_user.email,
					subject: 'Nova comentário em sua postagem',
					html: TemplateUtil.template('emails/received-comment.html', {
						title: post.title,
						user: user.name,
						comment: data.comment,
					}),
				});
				res.json({ data: comments });
			} else {
				res.json({ error: 'Erro ao criar Comentário' });
			}
		});
	}

	private async deleteComment(router: Router) {
		router.post('/comments/delete/:id', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const comment = (await DataBase.get('comments', req.params.id)) as CommentInterface;
			if (comment) {
				if (comment.user_id == user.id.toString()) {
					const deleted = await DataBase.delete('comments', req.params.id);
					if (deleted) {
						const comments = await this.commentsWithUser(comment.post_id);
						res.json({ data: comments });
					} else {
						res.json({ error: 'Erro ao deletar Comentário' });
					}
				} else {
					res.json({ error: 'Comentário não pertence a esse usuário' });
				}
			} else {
				res.json({ error: 'Comentário não encontrado' });
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
