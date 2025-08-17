import { WebSocketController } from './controllers/WebSocketController';
import { server } from './server';

describe('Testando server.ts', () => {
	afterAll((done) => {
		WebSocketController.disconnect();
		server.close(done);
	});
	it('Server deve estar online', () => {
		expect(server).toBeTruthy();
	});
});
