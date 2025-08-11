import express from 'express';
import cors from 'cors';

import { Router, Request, Response } from 'express';
import { Routes } from './routes';
import dotenv from 'dotenv';
import { DataBase } from './models/DataBase';
import bodyParser from 'body-parser';
import { RabbitController } from './controllers/RabbitController';

dotenv.config({ path: '.env' });

const app = express();

const options: cors.CorsOptions = {
	origin: '*',
};

DataBase.loadDB();
RabbitController.receive('email');

app.use(cors(options));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'Hello world Typescript',
		test_env: process.env.TEST_ENV,
	});
});

new Routes(router);

app.use(router);

const APP_PORT = process.env.APP_PORT || 3000;
app.listen(APP_PORT, () => `server running on port ${APP_PORT}`);

export default app;
