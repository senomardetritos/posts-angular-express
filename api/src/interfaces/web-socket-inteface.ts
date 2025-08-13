import { WebSocket } from 'ws';

export interface WebSocketClientInteface {
	email: string;
	ws: WebSocket;
}
