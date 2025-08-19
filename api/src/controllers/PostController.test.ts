import request from 'supertest';
import { app, server } from '../server';
import { WebSocketController } from './WebSocketController';
import { DataBase } from '../models/DataBase';
import 'jsonwebtoken';

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

describe('Testando Controller Post', () => {
	const customHeaders = {
		Authorization: 'Bearer YOUR_TOKEN',
		'Content-Type': 'application/json',
	};

	beforeEach(() => jest.clearAllMocks());

	afterAll((done) => {
		WebSocketController.disconnect();
		server.close(done);
	});

	it('Deveria retornar posts no listPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				return Promise.resolve([{ id: 1 }]);
			}
		});
		const response = await request(app).get('/posts').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria retornar posts vazios se não tiver no banco no listPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				return Promise.resolve([]);
			}
		});
		const response = await request(app).get('/posts').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).toBe(0);
	});

	it('Deveria catch error no listPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ id: 1, ...data }]);
			} else {
				throw new Error();
			}
		});
		const response = await request(app).get('/posts').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao listar post');
	});

	it('Deveria retornar posts no lastsPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const lastsSpy = jest.spyOn(DataBase, 'last');
		lastsSpy.mockImplementation((db_name, limit) => {
			return Promise.resolve([{ id: 1, user_id: 1 }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve([{ id: 1 }]);
		});
		const response = await request(app).get('/posts/lasts').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria retornar posts vazios se não tiver no banco no lastsPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const lastsSpy = jest.spyOn(DataBase, 'last');
		lastsSpy.mockImplementation((db_name, limit) => {
			return Promise.resolve([]);
		});
		const response = await request(app).get('/posts/lasts').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).toBe(0);
	});

	it('Deveria catch error no lastsPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const lastsSpy = jest.spyOn(DataBase, 'last');
		lastsSpy.mockImplementation((db_name, limit) => {
			throw new Error();
		});
		const response = await request(app).get('/posts/lasts').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao listar post');
	});

	it('Deveria retornar posts no searchPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			return Promise.resolve([{ id: 1, user_id: 1 }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1 });
		});
		const response = await request(app).get('/posts/search/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).not.toBe(0);
	});

	it('Deveria retornar posts vazios se não tiver no banco no searchPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			return Promise.resolve([]);
		});
		const response = await request(app).get('/posts/search/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.length).toBe(0);
	});

	it('Deveria catch error no searchPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const likeSpy = jest.spyOn(DataBase, 'like');
		likeSpy.mockImplementation((db_name, data) => {
			throw new Error();
		});
		const response = await request(app).get('/posts/search/teste').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao listar post');
	});

	it('Deveria retornar post no getPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 1 });
		});
		const response = await request(app).get('/posts/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data).not.toBe(0);
	});

	it('Deveria retornar erro se não encontrar post no getPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({});
		});
		const response = await request(app).get('/posts/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao listar post');
	});

	it('Deveria retornar erro se post nao for do usuário no getPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 2 });
		});
		const response = await request(app).get('/posts/1').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Post não pertence a esse usuário');
	});

	it('Deveria inserir o post no insertPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const insertSpy = jest.spyOn(DataBase, 'insert');
		insertSpy.mockImplementation((db_name, data) => {
			return Promise.resolve({ id: 1, user_id: 1 });
		});
		const response = await request(app).post('/posts/add').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.user_id).toBe(1);
	});

	it('Deveria retornar erro se não inserir o post no insertPost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const insertSpy = jest.spyOn(DataBase, 'insert');
		insertSpy.mockImplementation((db_name, data) => {
			return Promise.resolve(false);
		});
		const response = await request(app).post('/posts/add').set(customHeaders).send();
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao criar post');
	});

	it('Deveria atualizar o post no updatePost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const data_update = { id: 1, user_id: 1, title: 'Teste' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 1 });
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data) => {
			return Promise.resolve(data_update);
		});
		const response = await request(app).post('/posts/update/1').set(customHeaders).send(data_update);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.title).toBe('Teste');
	});

	it('Deveria retornar erro se não atualizar o post no updatePost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const data_update = { id: 1, user_id: 1, title: 'Teste' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 1 });
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data) => {
			return Promise.resolve(false);
		});
		const response = await request(app).post('/posts/update/1').set(customHeaders).send(data_update);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao atualizar post');
	});

	it('Deveria retornar erro se o post não for do usuário no updatePost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const data_update = { id: 1, user_id: 1, title: 'Teste' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({ id: 1, user_id: 2 });
		});
		const response = await request(app).post('/posts/update/1').set(customHeaders).send(data_update);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Post não pertence a esse usuário');
	});

	it('Deveria retornar erro se não encontrar o post no updatePost', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const data_update = { id: 1, user_id: 1, title: 'Teste' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const getSpy = jest.spyOn(DataBase, 'get');
		getSpy.mockImplementation((db_name, key) => {
			return Promise.resolve({});
		});
		const response = await request(app).post('/posts/update/1').set(customHeaders).send(data_update);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Post não encontrado');
	});
});
