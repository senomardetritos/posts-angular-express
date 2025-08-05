import mysql from 'mysql2-async';

export class DataBase {
	private static db: mysql;

	public static async loadDB() {
		if (!this.db) {
			this.db = new mysql({
				host: process.env.DB_HOST,
				port: parseInt(process.env.DB_PORT || '3306'),
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_DATABASE,
				timezone: '+03:00',
				skiptzfix: true,
			});
		}
	}

	public static async get(db_name: string, key: string) {
		try {
			const rows = await this.db.getall(`select * from ${db_name} where id = '${key}'`);
			return rows[0];
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public static async find(db_name: string, key: string, value: string) {
		try {
			const rows = await this.db.getall(`select * from ${db_name} where ${key} = '${value}'`);
			return rows;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public static async first(db_name: string, limit: number) {
		try {
			const rows = await this.db.getall(`select * from ${db_name} limit 0, ${limit}`);
			return rows;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public static async all(db_name: string): Promise<any> {
		try {
			const rows = await this.db.getall(`select * from ${db_name}`);
			return rows;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public static async insert(db_name: string, data: Object) {
		try {
			const query: string[] = [];
			query.push(`insert into ${db_name} (`);
			query.push(Object.keys(data).join(', '));
			query.push(') values (');
			const values: string[] = [];
			Object.values(data).map((item: any) => {
				values.push(`'${item}'`);
			});
			query.push(values.join(', '));
			query.push(');');
			const id = await this.db.insert(query.join(' '));
			return { id, ...data };
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	public static async update(db_name: string, key: string, data: Object) {
		try {
			const query: string[] = [];
			query.push(`update ${db_name} set`);
			const values: string[] = [];
			Object.keys(data).map((key: any) => {
				values.push(`${key} = '${data[key as keyof Object].toString()}'`);
			});
			query.push(values.join(', '));
			query.push(`where id = ${key}`);
			query.push(';');
			await this.db.update(query.join(' '));
			return data;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	public static async delete(db_name: string, key: string) {
		try {
			const query: string[] = [];
			query.push(`delete from ${db_name}`);
			const values: string[] = [];
			query.push(`where id = ${key}`);
			query.push(';');
			await this.db.delete(query.join(' '));
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
