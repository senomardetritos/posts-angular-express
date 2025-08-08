import { Request, Response, Router } from 'express';
import { DataBase } from '../models/DataBase';
import { UserMiddleware } from '../middlewares/UserMiddleware';
import { UserInterface } from '../interfaces/user-interface';
import { FriendInterface } from '../interfaces/friend-interface';
import { RowDataPacket } from 'mysql2';

export class FriendController {
	constructor(router: Router) {
		router.use('/friends', UserMiddleware.isLogged);
		this.getFriend(router);
		this.searchFriend(router);
		this.getFollow(router);
		this.changeFollow(router);
	}

	private async getFriend(router: Router) {
		router.get('/friends/:id', async (req: Request, res: Response) => {
			const friend = await this.getFriendData(req.params.id);
			if (friend) {
				res.json({ data: { ...friend } });
			} else {
				res.json({ error: 'Erro ao buscar friend' });
			}
		});
	}

	private async searchFriend(router: Router) {
		router.get('/friends/search/:search', async (req: Request, res: Response) => {
			const data = {
				email: req.params.search,
				name: req.params.search,
			};
			const users = (await DataBase.like('users', data)) as UserInterface[];
			const friends: FriendInterface[] = [];
			for (const user of users) {
				const friend = await this.getFriendData(user.id.toString());
				friends.push(friend);
			}
			if (friends) {
				res.json({ data: friends });
			} else {
				res.json({ error: 'Erro ao pesquisar friends' });
			}
		});
	}

	private async getFollow(router: Router) {
		router.get('/friends/follow/:id', async (req: Request, res: Response) => {
			const logged = (res.getHeader('user') || {}) as UserInterface;
			const sql = `
				select users.*, friends.date as meet from users, friends
				where friends.user_id = ? and friends.friend_id = ?
			`;
			const data = (await DataBase.query(sql, [logged.id, req.params.id])) as RowDataPacket[];
			if (data && data.length > 0) {
				res.json({ data: true });
			} else {
				res.json({ data: false });
			}
		});
	}

	private async changeFollow(router: Router) {
		router.post('/friends/change-follow/:id', async (req: Request, res: Response) => {
			const logged = (res.getHeader('user') || {}) as UserInterface;
			const sql = `
				select friends.id from users, friends
				where friends.user_id = ? and friends.friend_id = ?
			`;
			const data = (await DataBase.query(sql, [logged.id, req.params.id])) as RowDataPacket[];
			if (data && data.length > 0) {
				await DataBase.delete('friends', data[0].id);
				res.json({ data: false });
			} else {
				DataBase.insert('friends', { user_id: logged.id, friend_id: req.params.id });
				res.json({ data: true });
			}
		});
	}

	private async getFriendData(id: string) {
		const user = await DataBase.get('users', id);
		const following = await this.getFollowing(id);
		const followers = await this.getFollowers(id);
		const posts = await DataBase.find('posts', 'user_id', id);
		return { user, following, followers, posts } as FriendInterface;
	}

	private async getFollowing(id: string) {
		const sql = `
			select users.*, friends.date as meet from users, friends
			where friends.friend_id = users.id and friends.user_id = ?
		`;
		return await DataBase.query(sql, [id]);
	}

	private async getFollowers(id: string) {
		const sql = `
			select users.*, friends.date as meet from users, friends
			where friends.user_id = users.id and friends.friend_id = ?
		`;
		return await DataBase.query(sql, [id]);
	}
}
