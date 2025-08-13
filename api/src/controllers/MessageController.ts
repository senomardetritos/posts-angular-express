import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { UserInterface } from '../interfaces/user-interface';
import { RowDataPacket } from 'mysql2';

export class MessageController {
	constructor(router: Router) {
		router.use('/messages', UserMiddleware.isLogged);
		this.getMessages(router);
		this.setViewedMessages(router);
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
			const sqlUpdate = 'update messages set viewed = 1 where to_id = ? and from_id = ? and viewed = 0';
			await DataBase.query(sqlUpdate, [user.id, req.params.user]);
			res.json({
				data: Object.values(messagesList).sort((a, b) => {
					return a.date - b.date;
				}),
			});
		});
	}

	private async setViewedMessages(router: Router) {
		router.post('/messages/viewed/:user', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const sqlUpdate = 'update messages set viewed = 1 where to_id = ? and from_id = ? and viewed = 0';
			await DataBase.query(sqlUpdate, [user.id, req.params.user]);
			res.json({ data: {} });
		});
	}

	private async getMessagesUsers(router: Router) {
		router.get('/messages/users', async (req: Request, res: Response) => {
			const user = (res.getHeader('user') || {}) as UserInterface;
			const sqlAllIds = 'select to_id, from_id from messages where from_id = ? or to_id = ? group by to_id, from_id';
			const allIds = (await DataBase.query(sqlAllIds, [user.id, user.id])) as RowDataPacket[];
			const messages: RowDataPacket[] = [];
			for (const item of allIds) {
				const sql = 'select * from messages where from_id = ? and to_id = ? order by date desc limit 0,1';
				const res = (await DataBase.query(sql, [item.from_id, item.to_id])) as RowDataPacket[];
				messages.push(res[0]);
			}
			const messagesUsers: any[] = [];
			for (const message of messages) {
				if (message.from_id == user.id) {
					const userAux = await DataBase.get('users', message.to_id);
					this.addUserMessage(messagesUsers, userAux, message);
				} else if (message.to_id == user.id) {
					const userAux = await DataBase.get('users', message.from_id);
					this.addUserMessage(messagesUsers, userAux, message);
				}
			}
			res.json({ data: messagesUsers });
		});
	}

	private addUserMessage(messages: any, user: any, message: any) {
		const index = messages.findIndex((item: any) => item.id === user.id);
		if (index === -1) {
			messages.push({
				id: user.id,
				name: user.name,
				email: user.email,
				message: message.message,
				date: message.date,
			});
		} else {
			if (messages[index].date < message.date) {
				messages[index] = {
					id: user.id,
					name: user.name,
					email: user.email,
					message: message.message,
					date: message.date,
				};
			}
		}
		return messages;
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
