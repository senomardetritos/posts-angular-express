import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { PostController } from './controllers/PostController';

export class Routes {
	constructor(router: Router) {
		new UserController(router);
		new PostController(router);
	}
}
