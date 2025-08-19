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

	it('Deveria retornar friend no getFriend', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1 });
		});
		const response = await request(app).get('/friends/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
	});

	it('Deveria retornar erro se não encontrar friend no getFriend', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({});
		});
		const response = await request(app).get('/friends/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao buscar friend');
	});

	it('Deveria retornar friends no searchFriend', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1 });
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			return Promise.resolve([{ id: 1 }]);
		});
		const response = await request(app).get('/friends/search/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
	});

	it('Deveria retornar [] se não encontrar friends no searchFriend', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1 });
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			return Promise.resolve([]);
		});
		const response = await request(app).get('/friends/search/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).toBe(0);
	});

	it('Deveria retornar erro se não encontrar friends no searchFriend', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1 });
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			throw new Error();
		});
		const response = await request(app).get('/friends/search/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao pesquisar friends');
	});

	it('Deveria retornar true no getFollow se encontrar seguidor', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, data) => {
			return Promise.resolve([{ id: 1 }] as RowDataPacket[]);
		});
		const response = await request(app).get('/friends/follow/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data).toBe(true);
	});

	it('Deveria retornar false no getFollow se não encontrar seguidor', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, data) => {
			return Promise.resolve([] as RowDataPacket[]);
		});
		const response = await request(app).get('/friends/follow/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data).toBe(false);
	});

	it('Deveria inserir seguidor se não for ainda no changeFollow', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, data) => {
			return Promise.resolve([] as RowDataPacket[]);
		});
		const insertSpy = jest.spyOn(DataBase, 'insert');
		insertSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1 });
		});
		const response = await request(app).post('/friends/change-follow/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data).toBe(true);
	});

	it('Deveria inserir seguidor se não for ainda no changeFollow', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const querySpy = jest.spyOn(DataBase, 'query');
		querySpy.mockImplementation((sql, data) => {
			return Promise.resolve([{ id: 1 }] as RowDataPacket[]);
		});
		const deleteSpy = jest.spyOn(DataBase, 'delete');
		deleteSpy.mockImplementation((db_name, key) => {
			return Promise.resolve(true);
		});
		const response = await request(app).post('/friends/change-follow/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data).toBe(false);
	});
});
