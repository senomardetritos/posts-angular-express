import nodemailer, { Transporter } from 'nodemailer';
import { MailerController } from './MailerController';

let sendMailMock = jest.fn();

jest.mock('nodemailer', () => ({
	createTransport: jest.fn().mockImplementation(() => ({
		sendMail: sendMailMock,
	})),
}));

describe('Testando Controller MailerController', () => {
	beforeEach(() => {
		sendMailMock.mockClear(); // Clear mock calls before each test
	});

	it('Deve enviar o email', () => {
		MailerController.sendEmail({
			to: 'teste@email.com',
			subject: 'Nova Curtida em sua postagem',
			html: '<h1>Nova Curtida em sua postagem</h1>',
		});
	});

	it('Deve enviar o email com porta padrão', () => {
		delete process.env.MAIL_PORT;
		MailerController.sendEmail({
			to: 'teste@email.com',
			subject: 'Nova Curtida em sua postagem',
			html: '<h1>Nova Curtida em sua postagem</h1>',
		});
	});

	it('Deve chamar callback com sucesso o sendEmail do transporter o email', () => {
		const dataEmail = {
			to: 'teste@email.com',
			subject: 'Nova Curtida em sua postagem',
			html: '<h1>Nova Curtida em sua postagem</h1>',
		};
		process.env['MAIL_USER'] = 'user@email.com';

		const options = {
			from: '"Posts Angular Express" <user@email.com>',
			...dataEmail,
		};
		sendMailMock = jest.fn((mailOptions, callback) => {
			callback(null, { response: 'Send Mail' });
		});
		MailerController.sendEmail(dataEmail);
		expect(sendMailMock).toHaveBeenCalledTimes(1);
	});

	it('Deve chamar callback com erro o sendEmail do transporter o email', () => {
		const dataEmail = {
			to: 'teste@email.com',
			subject: 'Nova Curtida em sua postagem',
			html: '<h1>Nova Curtida em sua postagem</h1>',
		};
		process.env['MAIL_USER'] = 'user@email.com';

		const options = {
			from: '"Posts Angular Express" <user@email.com>',
			...dataEmail,
		};
		sendMailMock = jest.fn((mailOptions, callback) => {
			callback(new Error('Mock email sending error'), null);
		});
		MailerController.sendEmail(dataEmail);
		expect(sendMailMock).toHaveBeenCalledTimes(1);
	});
});
