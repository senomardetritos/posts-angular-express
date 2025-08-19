import request from 'supertest';
import { app, server } from '../server';
import { WebSocketController } from './WebSocketController';
import { DataBase } from '../models/DataBase';
import 'jsonwebtoken';
import { MailerController } from './MailerController';

jest.mock('jsonwebtoken', () => ({
	// Mocked functions or values for jsonwebtoken
	sign: jest.fn().mockImplementation((payload) => payload),
	verify: jest.fn().mockImplementation((payload) => {
		if (payload) {
			return payload;
		} else {
			throw new Error('jsonwebtoken verify error');
		}
	}),
}));

describe('Testando Controller Like', () => {
	const customHeaders = {
		Authorization: 'Bearer YOUR_TOKEN',
		'Content-Type': 'application/json',
	};

	beforeEach(() => jest.clearAllMocks());

	afterAll((done) => {
		WebSocketController.disconnect();
		server.close(done);
	});

	it('Deveria retornar likes no listLike', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1 });
		});
		const response = await request(app).get('/likes/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria retornar [] se não encontrar likes no listLike', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				return Promise.resolve([]);
			}
		});
		const response = await request(app).get('/likes/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).toBe(0);
	});

	it('Deveria catch error likes no listLike', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				throw new Error();
			}
		});
		const response = await request(app).get('/likes/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao listar likes');
	});

	it('Deveria setar like no changeLike', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				return Promise.resolve([]);
			}
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 1 });
		});
		const insertSpy = jest.spyOn(DataBase, 'insert');
		insertSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1 });
		});
		const sendMailSpy = jest.spyOn(MailerController, 'sendEmail');
		sendMailSpy.mockImplementation((options) => {});
		const response = await request(app).post('/likes/change/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
	});

	it('Deveria se der erro ao inserir like no changeLike', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				return Promise.resolve([]);
			}
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 1 });
		});
		const insertSpy = jest.spyOn(DataBase, 'insert');
		insertSpy.mockImplementation((db_name, key) => {
			return Promise.resolve(false);
		});
		const response = await request(app).post('/likes/change/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao criar like');
	});

	it('Deveria deletar like no changeLike', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				return Promise.resolve([{ id: 1, user_id: 1 }]);
			}
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 1 });
		});
		const deleteSpy = jest.spyOn(DataBase, 'delete');
		deleteSpy.mockImplementation((db_name, key) => {
			return Promise.resolve(true);
		});
		const sendMailSpy = jest.spyOn(MailerController, 'sendEmail');
		sendMailSpy.mockImplementation((options) => {});
		const response = await request(app).post('/likes/change/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
	});

	it('Deveria retornar erro se não deletar like no changeLike', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				return Promise.resolve([{ id: 1, user_id: 1 }]);
			}
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 1 });
		});
		const deleteSpy = jest.spyOn(DataBase, 'delete');
		deleteSpy.mockImplementation((db_name, key) => {
			return Promise.resolve(false);
		});
		const sendMailSpy = jest.spyOn(MailerController, 'sendEmail');
		const response = await request(app).post('/likes/change/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao deletar like');
	});
});
