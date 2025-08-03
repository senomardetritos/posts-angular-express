export class EnvUtil {
	public static getEnv(key: string): string {
		return process.env[key] ?? 'ENV_NAO_SETADO';
	}
}
