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

describe('Testando Controller Usuário', () => {
	const customHeaders = {
		Authorization: 'Bearer YOUR_TOKEN',
		'Content-Type': 'application/json',
	};

	beforeEach(() => jest.clearAllMocks());

	afterAll((done) => {
		WebSocketController.disconnect();
		server.close(done);
	});

	it('Register com dados válidos', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve(null);
		});
		const insertSpy = jest.spyOn(DataBase, 'insert');
		insertSpy.mockImplementation((db_name, data_insert) => {
			return Promise.resolve({ id: 1, ...data });
		});
		const response = await request(app).post('/register').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body.data).toHaveProperty('email');
		expect(response.body.data.email).toBe(data.email);
	});

	it('Register com usuario existente', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ ...data }]);
		});
		const response = await request(app).post('/register').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Usuário já cadastrado!');
	});

	it('Register com erro ao insert', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([]);
		});
		const insertSpy = jest.spyOn(DataBase, 'insert');
		insertSpy.mockImplementation((db_name, data_insert) => {
			return Promise.resolve(false);
		});
		delete process.env.API_KEY;
		const response = await request(app).post('/register').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao cadastrar');
	});

	it('Login com dados válidos', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const response = await request(app).post('/login').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body.data).toHaveProperty('token');
		expect(response.body.data.token).toBe(data.email);
	});

	it('Login com dados com senha incorreta', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, email: 'teste@email.com', password: '123s' }]);
		});
		const response = await request(app).post('/login').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Senha incorreta!');
	});

	it('Login com dados usuarios não encontrado', async () => {
		const data = { email: 'teste', password: '' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve(null);
		});
		const response = await request(app).post('/login').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Usuário não encontrado!');
	});

	it('Login entrando no catch', async () => {
		const data = { email: 'teste@email.com' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		delete process.env.API_KEY;
		const response = await request(app).post('/login').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('jsonwebtoken verify error');
	});

	it('sendForgotPassword com dados válidos', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ email: data.email }]);
		});
		const insertSpy = jest.spyOn(DataBase, 'insert');
		insertSpy.mockImplementation((db_name, data_insert) => {
			return Promise.resolve({ id: 1 });
		});
		const deleteSpy = jest.spyOn(DataBase, 'delete');
		deleteSpy.mockImplementation((db_name, id) => {
			return Promise.resolve(true);
		});
		const sendEmailSpy = jest.spyOn(MailerController, 'sendEmail');
		sendEmailSpy.mockImplementation((data_insert) => {
			return Promise.resolve();
		});
		const response = await request(app).post('/send-email-forgot-password').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body.data).toHaveProperty('email');
		expect(response.body.data.email).toBe(data.email);
	});

	it('sendForgotPassword com usuario null', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve(null);
		});
		const response = await request(app).post('/send-email-forgot-password').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Usuário não encontrado!');
	});

	it('sendForgotPassword com usuario valido e otp null', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			if (db_name == 'users') {
				return Promise.resolve([{ ...data }]);
			} else {
				return Promise.resolve(null);
			}
		});
		const response = await request(app).post('/send-email-forgot-password').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body.data).toHaveProperty('email');
		expect(response.body.data.email).toBe(data.email);
	});

	it('changeForgotPassword com usuario valido', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ ...data }]);
		});
		const whereSpy = jest.spyOn(DataBase, 'where');
		whereSpy.mockImplementation((db_name, data_where) => {
			return Promise.resolve([{ id: 1 }]);
		});
		const deleteSpy = jest.spyOn(DataBase, 'delete');
		deleteSpy.mockImplementation((db_name, key) => {
			return Promise.resolve(true);
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data_update) => {
			return Promise.resolve(true);
		});
		const response = await request(app).post('/change-forgot-password').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body.data).toHaveProperty('email');
		expect(response.body.data.email).toBe(data.email);
	});

	it('changeForgotPassword com usuario invalido', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve(null);
		});
		const response = await request(app).post('/change-forgot-password').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Usuário não encontrado!');
	});

	it('changeForgotPassword com codigo invalido', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ ...data }]);
		});
		const whereSpy = jest.spyOn(DataBase, 'where');
		whereSpy.mockImplementation((db_name, data_where) => {
			return Promise.resolve(null);
		});
		const response = await request(app).post('/change-forgot-password').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Código incorreto!');
	});

	it('changeForgotPassword com update false', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ ...data }]);
		});
		const whereSpy = jest.spyOn(DataBase, 'where');
		whereSpy.mockImplementation((db_name, data_where) => {
			return Promise.resolve([{ id: 1 }]);
		});
		const deleteSpy = jest.spyOn(DataBase, 'delete');
		deleteSpy.mockImplementation((db_name, key) => {
			return Promise.resolve(true);
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data_update) => {
			return Promise.resolve(false);
		});
		const response = await request(app).post('/change-forgot-password').set('content-type', 'application/json').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao atualizar senha!');
	});

	it('Deveria retornar o user no res.getHeader', async () => {
		const data = { email: 'teste123@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ ...data }]);
		});
		const response = await request(app).get('/users/get').set(customHeaders).send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data.email).toBe(data.email);
	});

	it('Deveria atualizar o user no updateUser', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data_update) => {
			return Promise.resolve(true);
		});
		const response = await request(app).post('/users/update').set(customHeaders).send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data).toBe(true);
	});

	it('Não deveria atualizar se email = teste@email.com', async () => {
		const data = { email: 'teste@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const response = await request(app).post('/users/update').set(customHeaders).send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Usuário de teste não pode ser alterado');
	});

	it('Deveria retornar erro se updated = false', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data_update) => {
			return Promise.resolve(false);
		});
		const response = await request(app).post('/users/update').set(customHeaders).send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao atualizar perfil');
	});

	it('Deveria retornar erro se não encontrar usuario pelo token', async () => {
		const data = { email: 'testenovo@email.com', password: '123456' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve(null);
		});
		const response = await request(app).post('/users/update').set(customHeaders).send(data);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Não autorizado');
	});

	it('Deveria atualizar o password no changePassword', async () => {
		const data = { email: 'testenovo@email.com', password: '123456', actual_password: '123456', new_password: '123' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data_update) => {
			return Promise.resolve(true);
		});
		const response = await request(app).post('/users/change-password').set(customHeaders).send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('data');
		expect(response.body.data).toBe(true);
	});

	it('Não deveria atualizar o password se email = teste@email.com', async () => {
		const data = { email: 'teste@email.com', password: '123456', actual_password: '123456', new_password: '123' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const response = await request(app).post('/users/change-password').set(customHeaders).send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Usuário de teste não pode ser alterado');
	});

	it('Deveria retornar erro se nao atualizar', async () => {
		const data = { email: 'testenovo@email.com', password: '123456', actual_password: '123456', new_password: '123' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data_update) => {
			return Promise.resolve(false);
		});
		const response = await request(app).post('/users/change-password').set(customHeaders).send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Erro ao atualizar senha');
	});

	it('Deveria retornar erro se senha não for igual', async () => {
		const data = { email: 'testenovo@email.com', password: '123456', actual_password: '123' };
		const findSpy = jest.spyOn(DataBase, 'find');
		findSpy.mockImplementation((db_name, key, value) => {
			return Promise.resolve([{ id: 1, ...data }]);
		});
		const updateSpy = jest.spyOn(DataBase, 'update');
		updateSpy.mockImplementation((db_name, key, data_update) => {
			return Promise.resolve(false);
		});
		const response = await request(app).post('/users/change-password').set(customHeaders).send(data);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('error');
		expect(response.body.error).toBe('Senha atual incorreta');
	});
});
