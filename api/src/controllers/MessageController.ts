import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { UserInterface } from '../interfaces/user-interface';
import { RowDataPacket } from 'mysql2';

export class MessageController {
	constructor(router: Router) {
		router.use('/messages', UserMiddleware.isLogged);
		this.getMessages(router);
		this.getMessagesUsers(router);
		this.searchUser(router);
	}

	private async getMessages(router: Router) {
		router.get('/messages/list/:user', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const sqlTo = 'select m.id, u.id as user_id, u.name, m.message, m.date from messages m, users u where m.to_id = ? and m.from_id = ? and u.id = m.from_id order by m.date desc';
			const to = (await DataBase.query(sqlTo, [user.id, req.params.user])) as RowDataPacket[];
			const sqlFrom = 'select m.id, u.id as user_id, u.name, m.message, m.date from messages m, users u where m.from_id = ? and m.to_id = ? and u.id = m.from_id order by m.date desc';
			const from = (await DataBase.query(sqlFrom, [user.id, req.params.user])) as RowDataPacket[];
			const result = [...to, ...from];
			const messagesList: { [key: string]: RowDataPacket } = {};
			result.map((item) => {
				const key = item.id;
				if (!messagesList[key]) {
					messagesList[key] = item;
				}
			});
			res.json({
				data: Object.values(messagesList).sort((a, b) => {
					return a.date - b.date;
				}),
			});
		});
	}

	private async getMessagesUsers(router: Router) {
		router.get('/messages/users', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const sqlTo = 'select u.id, u.name, m.message, m.date from messages m, users u where m.to_id = ? and u.id = m.from_id group by m.from_id order by m.date desc';
			const to = (await DataBase.query(sqlTo, [user.id])) as RowDataPacket[];
			const sqlFrom = 'select u.id, u.name, m.message, m.date from messages m, users u where m.from_id = ? and u.id = m.to_id group by m.to_id order by m.date desc';
			const from = (await DataBase.query(sqlFrom, [user.id])) as RowDataPacket[];
			const result = [...to, ...from];
			const messagesList: { [key: string]: RowDataPacket } = {};
			result.map((item) => {
				const key = item.id;
				if (messagesList[key]) {
					const message = messagesList[key];
					if (message.date < item.date) {
						messagesList[key] = item;
					}
				} else {
					messagesList[key] = item;
				}
			});
			res.json({
				data: Object.values(messagesList).sort((a, b) => {
					return b.date - a.date;
				}),
			});
		});
	}

	private async searchUser(router: Router) {
		router.get('/messages/search-user/:search', async (req: Request, res: Response) => {
			const data = {
				email: req.params.search,
				name: req.params.search,
			};
			const users = (await DataBase.like('users', data)) as UserInterface[];
			if (users) {
				res.json({ data: users });
			} else {
				res.json({ error: 'Erro ao pesquisar usuários' });
			}
		});
	}
}
