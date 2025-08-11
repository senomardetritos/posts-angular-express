import { readFileSync } from 'fs';

export class TemplateUtil {
	public static template(name: string, data: object) {
		let fileText = readFileSync(`templates/${name}`, 'utf8');
		for (const key in data) {
			const res = (data as { [key: string]: any })[key];
			fileText = fileText.replace(`\$\{${key}\}`, res);
		}
		return fileText;
	}
}
