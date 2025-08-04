import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { PostController } from './controllers/PostController';
import { LikeController } from './controllers/LikeController';
import { CommentController } from './controllers/CommentController';

export class Routes {
	constructor(router: Router) {
		new UserController(router);
		new PostController(router);
		new LikeController(router);
		new CommentController(router);
	}
}
