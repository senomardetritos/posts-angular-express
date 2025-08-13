export interface WebSocketInterface {
  type: string;
  content: WebSocketMessageInteface;
}

export interface WebSocketMessageInteface {
  from: string;
  to: string;
  message: string;
}

export interface NewWebSocketMessageInteface {
  from: string;
  messages: string[];
}
