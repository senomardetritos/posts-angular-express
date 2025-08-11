import amqp, { Connection } from 'amqplib/callback_api';
import { MailerController } from './MailerController';

export class RabbitController {
	private static connection: Connection;

	constructor() {}

	public static connect() {
		return new Promise((resolve, reject) => {
			amqp.connect('amqp://localhost:5672', (error, connection) => {
				if (error) {
					throw error;
					reject();
				} else {
					this.connection = connection;
					resolve(this);
				}
			});
		});
	}

	public static async send(queue: string, message: string) {
		await this.connect();
		if (this.connection) {
			this.connection.createChannel(function (error, channel) {
				if (error) {
					throw error;
				} else {
					channel.assertQueue(queue, {
						durable: false,
					});
					channel.sendToQueue(queue, Buffer.from(message));
				}
			});
		} else {
			throw 'Conexão não estabelecida';
		}
	}

	public static async sendObject(queue: string, data: object) {
		this.send(queue, JSON.stringify(data));
	}

	public static async receive(queue: string) {
		await this.connect();
		if (this.connection) {
			this.connection.createChannel(function (error, channel) {
				if (error) {
					throw error;
				} else {
				}
				channel.assertQueue(queue, {
					durable: false,
				});
				console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
				channel.consume(
					queue,
					(message) => {
						if (message && message.content) {
							switch (queue) {
								case 'email':
									MailerController.sendEmail(JSON.parse(message.content.toString()));
								default:
									console.log(`Queue ${queue}: ${message.content}`);
							}
						} else {
							console.log(`Error no Queue ${queue}: ${message?.content.toString()}`);
						}
					},
					{
						noAck: true,
					}
				);
			});
		} else {
			throw 'Conexão não estabelecida';
		}
	}
}
