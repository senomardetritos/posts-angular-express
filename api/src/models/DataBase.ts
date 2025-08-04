import { JSONFilePreset } from 'lowdb/node';

export class DataBase {
	private static db: any;

	public static async loadDB() {
		if (!this.db) {
			const defaultData: any = {};
			this.db = await JSONFilePreset(`./database/dados.json`, defaultData);
			this.db.write();
		}
	}

	private static async setDB(db_name: string) {
		if (!this.db.data[db_name]) {
			this.db.data[db_name] = [];
			this.db.write();
		}
	}

	public static async get(db_name: string, key: string) {
		try {
			this.setDB(db_name);
			const data = this.db.data[db_name].filter((data: any) => data.id === key);
			return data[0];
		} catch (error) {
			console.error(error);
		}
	}

	public static async find(db_name: string, key: string, value: string) {
		try {
			this.setDB(db_name);
			const data = this.db.data[db_name].filter((data: any) => data[key] == value);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	public static async first(db_name: string, limit: number) {
		try {
			this.setDB(db_name);
			const data = this.db.data[db_name].slice(0, limit);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	public static async all(db_name: string) {
		try {
			this.setDB(db_name);
			const data = this.db.data[db_name];
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	public static async insert(db_name: string, key: string, data: Object) {
		try {
			this.setDB(db_name);
			const data_to_save = { ...data, id: key };
			this.db.data[db_name].push(data_to_save);
			await this.db.write();
			return data_to_save;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	public static async update(db_name: string, key: string, data: Object) {
		try {
			this.setDB(db_name);
			const index = this.db.data[db_name].findIndex((register: any) => register.id === key);
			const actual = this.db.data[db_name][index];
			this.db.data[db_name][index] = { ...actual, ...data };
			await this.db.write();
			return data;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	public static async delete(db_name: string, key: string) {
		try {
			this.setDB(db_name);
			const data = this.db.data[db_name].filter((data: any) => data.id !== key);
			this.db.data[db_name] = data;
			await this.db.write();
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
