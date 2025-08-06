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
				timezone: process.env.DB_TIME_ZONE ?? '+03:00',
				skiptzfix: true,
			});
		}
	}

	public static async query(sql: string, params: Array<any>) {
		try {
			const rows = await this.db.query(sql, params);
			return rows;
		} catch (error) {
			console.error(error);
			return null;
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

	public static async where(db_name: string, data: Object) {
		try {
			const query: string[] = [];
			query.push(`select * from ${db_name} where `);
			const values: string[] = [];
			Object.keys(data).map((key: any) => {
				values.push(`${key} = '${data[key as keyof Object].toString()}'`);
			});
			query.push(values.join(' and '));
			const rows = await this.db.getall(query.join(' '));
			return rows;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public static async like(db_name: string, data: Object) {
		try {
			const query: string[] = [];
			query.push(`select * from ${db_name} where `);
			const values: string[] = [];
			Object.keys(data).map((key: any) => {
				values.push(`${key} like '%${data[key as keyof Object].toString()}%'`);
			});
			query.push(values.join(' or '));
			const rows = await this.db.getall(query.join(' '));
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

	public static async last(db_name: string, limit: number) {
		try {
			const rows = await this.db.getall(`select * from ${db_name} order by id desc limit 0, ${limit}`);
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
			const params: string[] = [];
			query.push(`insert into ${db_name} (`);
			query.push(Object.keys(data).join(', '));
			query.push(') values (');
			const values: string[] = [];
			Object.values(data).map((item: any) => {
				values.push('?');
				params.push(item);
			});
			query.push(values.join(', '));
			query.push(');');
			const id = await this.db.insert(query.join(' '), params);
			return { id, ...data };
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	public static async update(db_name: string, key: string, data: Object) {
		try {
			const query: string[] = [];
			const params: string[] = [];
			query.push(`update ${db_name} set`);
			const values: string[] = [];
			Object.keys(data).map((key: any) => {
				values.push(`${key} = ?`);
				params.push(data[key as keyof Object].toString());
			});
			query.push(values.join(', '));
			query.push(`where id = ${key}`);
			query.push(';');
			await this.db.update(query.join(' '), params);
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
