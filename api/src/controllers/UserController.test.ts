import request from 'supertest';
import app from '../server';

describe('Testando Controller Usuário', () => {
	describe('Rota de Login', () => {
		it('Login existe', async () => {
			const response = await request(app).get('/').set('content-type', 'application/json').send();
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('message');
		});
	});
});
