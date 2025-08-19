import mysql from 'mysql2-async';
import { DataBase } from './DataBase';

let mockDBFunction = jest.fn();
jest.mock('mysql2-async', () => {
	return jest.fn().mockImplementation(() => {
		return {
			query: mockDBFunction,
			getall: mockDBFunction,
			insert: mockDBFunction,
			update: mockDBFunction,
			delete: mockDBFunction,
		};
	});
});

describe('Testando Controller MailerController', () => {
	beforeEach(() => {
		DataBase.loadDB();
		mockDBFunction.mockClear();
	});

	it('Deve executar o query', () => {
		DataBase.query('select ?', [1]);
	});

	it('Deve dar erro no query', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.query('select ?', [1]);
	});

	it('Deve executar o get', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.get('users', '1');
	});

	it('Deve dar erro no get', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.get('users', '1');
	});

	it('Deve executar o find', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.find('users', 'id', '1');
	});

	it('Deve dar erro no find', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.find('users', 'id', '1');
	});

	it('Deve executar o where', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.where('users', [{ id: 1 }]);
	});

	it('Deve dar erro no where', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.where('users', [{ id: 1 }]);
	});

	it('Deve executar o like', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.like('users', [{ id: 1 }]);
	});

	it('Deve dar erro no like', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.like('users', [{ id: 1 }]);
	});

	it('Deve executar o first', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.first('users', 1);
	});

	it('Deve dar erro no first', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.first('users', 1);
	});

	it('Deve executar o last', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.last('users', 1);
	});

	it('Deve dar erro no last', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.last('users', 1);
	});

	it('Deve executar o all', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.all('users');
	});

	it('Deve dar erro no all', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.all('users');
	});

	it('Deve executar o insert', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.insert('users', [{ id: 1 }]);
	});

	it('Deve dar erro no insert', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.insert('users', [{ id: 1 }]);
	});

	it('Deve executar o update', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.update('users', '1', [{ id: 1 }]);
	});

	it('Deve dar erro no update', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.update('users', '1', [{ id: 1 }]);
	});

	it('Deve executar o delete', () => {
		mockDBFunction.mockImplementation(() => {
			return [{ id: 1 }];
		});
		DataBase.delete('users', '1');
	});

	it('Deve dar erro no delete', () => {
		mockDBFunction.mockImplementation(() => {
			throw new Error('Error');
		});
		DataBase.delete('users', '1');
	});
});
