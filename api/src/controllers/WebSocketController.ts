import { Server } from 'http';
import { WebSocketServer, WebSocket, RawData } from 'ws';
import { WebSocketClientInteface } from '../interfaces/web-socket-inteface';
import { DataBase } from '../models/DataBase';
import { MessageInterface } from '../interfaces/message-interface';
import { RowDataPacket } from 'mysql2';

export class WebSocketController {
	private static clients = new Set<WebSocketClientInteface>();

	constructor(server: Server) {
		const wss = new WebSocketServer({
			server,
		});
		wss.on('connection', WebSocketController.onConnection);
		console.log(`App Web Socket Server is running!`);
	}

	public static onError(ws: WebSocket, err: Error) {
		console.error(`onError: ${err.message}`);
	}

	public static async onMessage(ws: WebSocket, data: RawData) {
		const res = JSON.parse(data.toString());
		const from = await DataBase.find('users', 'email', res.from);
		const to = await DataBase.find('users', 'email', res.to);
		if (from && to) {
			const messageDatabase = {
				from_id: from[0].id,
				to_id: to[0].id,
				message: res.message,
			};
			const inserted = await DataBase.insert('messages', messageDatabase);
			if (inserted) {
				const message = { from: res.from, to: res.to, message: res.message };
				WebSocketController.clients.forEach(async (client) => {
					if (client && client.ws.readyState === ws.OPEN && client.email === res.to) {
						client.ws.send(JSON.stringify(message));
						console.log(`Mensagem de ${res.from} para ${res.to}: ${res.message}`);
					}
				});
			}
		}
	}

	public static sendMemoryMessages(email: string) {
		WebSocketController.clients.forEach(async (client) => {
			if (client && client.ws.readyState === client.ws.OPEN && client.email === email) {
				const to = await DataBase.find('users', 'email', email);
				const sql = 'select m.id, u.id as user_id, u.name, m.message, u.email, m.date from messages m, users u where m.to_id = ? and u.id = m.from_id and m.viewed = 0 order by m.date desc';
				if (to) {
					const messages = (await DataBase.query(sql, [to[0].id])) as RowDataPacket[];
					messages.map((item) => {
						const message = { from: item.email, to: to[0].id, message: item.message };
						client.ws.send(JSON.stringify(message));
					});
				}
			}
		});
	}

	public static onConnection(ws: WebSocket, req: Request) {
		const email = req.url.split('=')[1];
		const client = { email: email, ws } as WebSocketClientInteface;
		WebSocketController.clients.add(client);
		WebSocketController.sendMemoryMessages(email);
		ws.on('message', (data) => WebSocketController.onMessage(ws, data));
		ws.on('error', (error) => WebSocketController.onError(ws, error));
		console.log(`Conectou com email: ${email}`);
	}
}
