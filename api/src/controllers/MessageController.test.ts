import request from 'supertest';
import { app, server } from '../server';
import { WebSocketController } from './WebSocketController';
import { DataBase } from '../models/DataBase';
import 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

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

describe('Testando Controller Message', () => {
	const customHeaders = {
		Authorization: 'Bearer YOUR_TOKEN',
		'Content-Type': 'application/json',
	};

	beforeEach(() => jest.clearAllMocks());

	afterAll((done) => {
		WebSocketController.disconnect();
		server.close(done);
	});

	it('Deveria retornar messages no getMessages', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, params) => {
			return Promise.resolve([
				{ id: 1, date: new Date('2025-08-02') },
				{ id: 2, date: new Date('2025-08-01') },
			] as RowDataPacket[]);
		});
		const response = await request(app).get('/messages/list/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria atualizar messages no setViewedMessages', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, params) => {
			return Promise.resolve([{ id: 1 }] as RowDataPacket[]);
		});
		const response = await request(app).post('/messages/viewed/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data).not.toBe({});
	});

	it('Deveria retornar messages quando for from_id no getMessagesUsers', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, params) => {
			return Promise.resolve([{ id: 1, from_id: 1, to_id: 2, date: new Date('2025-08-01') }] as RowDataPacket[]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: key });
		});
		const response = await request(app).get('/messages/users').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria retornar messages quando for to_id no getMessagesUsers', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, params) => {
			return Promise.resolve([{ id: 1, from_id: 2, to_id: 1, date: new Date('2025-08-01') }] as RowDataPacket[]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: key });
		});
		const response = await request(app).get('/messages/users').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria arrumar mensagens por data maior no addUserMessage', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, params) => {
			if (sql == 'select to_id, from_id from messages where from_id = ? or to_id = ? group by to_id, from_id') {
				return Promise.resolve([
					{ from_id: 1, to_id: 2 },
					{ from_id: 2, to_id: 1 },
				] as RowDataPacket[]);
			} else {
				if (params[0] == 1) {
					return Promise.resolve([{ id: 1, from_id: 1, to_id: 2, date: new Date('2025-08-01') }] as RowDataPacket[]);
				} else {
					return Promise.resolve([{ id: 1, from_id: 2, to_id: 1, date: new Date('2025-08-02') }] as RowDataPacket[]);
				}
			}
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: key });
		});
		const response = await request(app).get('/messages/users').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria retornar users no searchUser', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			return Promise.resolve([{ id: 1 }]);
		});
		const response = await request(app).get('/messages/search-user/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria retornar erro se não encontrar users no searchUser', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			return Promise.resolve([]);
		});
		const response = await request(app).get('/messages/search-user/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).toBe(0);
	});

	it('Deveria catch error no searchUser', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			throw new Error();
		});
		const response = await request(app).get('/messages/search-user/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao pesquisar usuários');
	});
});
