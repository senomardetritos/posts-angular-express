import express from 'express';
import cors from 'cors';

import { Router, Request, Response } from 'express';
import { Routes } from './routes';
import dotenv from 'dotenv';
import { DataBase } from './models/DataBase';

dotenv.config({ path: '.env' });

const app = express();

const options: cors.CorsOptions = {
	origin: '*',
};

DataBase.loadDB();

app.use(cors(options));

app.use(express.json());

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.json({ message: 'hello world with Typescript' });
});

new Routes(router);

app.use(router);

app.listen(3333, () => 'server running on port 3333');
