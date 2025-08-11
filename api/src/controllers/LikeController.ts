import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { LikeInterface } from '../interfaces/like-interface';
import { UserInterface } from '../interfaces/user-interface';
import { RabbitController } from './RabbitController';
import { MailerController } from './MailerController';
import { TemplateUtil } from '../utils/template-util';
import { PostInterface } from '../interfaces/post-interface';

export class LikeController {
	constructor(router: Router) {
		router.use('/likes', UserMiddleware.isLogged);
		this.listLike(router);
		this.changeLike(router);
	}

	private async listLike(router: Router) {
		router.get('/likes/:id', async (req: Request, res: Response) => {
			const likes = await this.likesWithUser(req.params.id);
			if (likes) {
				res.json({ data: likes });
			} else {
				res.json({ error: 'Erro ao listar likes' });
			}
		});
	}

	private async changeLike(router: Router) {
		router.post('/likes/change/:id', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const data = { post_id: req.params.id, user_id: user.id };
			const likes = (await DataBase.find('likes', 'post_id', req.params.id)) as LikeInterface[];
			const like = likes.filter((item: any) => item.user_id == user.id);
			const post = (await DataBase.get('posts', req.params.id)) as PostInterface;
			const post_user = (await DataBase.get('users', post.user_id.toString())) as UserInterface;
			if (like.length > 0) {
				const deleted = await DataBase.delete('likes', like[0].id);
				if (deleted) {
					const likes = await this.likesWithUser(req.params.id);
					res.json({ data: likes });
					RabbitController.sendObject('email', {
						to: post_user.email,
						subject: 'Perdeu uma curtida em sua postagem',
						html: TemplateUtil.template('emails/lost-like.html', { title: post.title, likes: likes.length }),
					});
				} else {
					res.json({ error: 'Erro ao criar like' });
				}
			} else {
				const inserted = await DataBase.insert('likes', data);
				if (inserted) {
					const likes = await this.likesWithUser(req.params.id);
					res.json({ data: likes });
					RabbitController.sendObject('email', {
						to: post_user.email,
						subject: 'Nova Curtida em sua postagem',
						html: TemplateUtil.template('emails/received-like.html', { title: post.title, likes: likes.length }),
					});
				} else {
					res.json({ error: 'Erro ao criar like' });
				}
			}
		});
	}

	private async likesWithUser(post_id: string) {
		const likes = (await DataBase.find('likes', 'post_id', post_id)) as LikeInterface[];
		const new_likes: LikeInterface[] = [];
		for (const item of likes) {
			const user = await DataBase.get('users', item.user_id);
			new_likes.push({ ...item, user });
		}
		return new_likes;
	}
}
