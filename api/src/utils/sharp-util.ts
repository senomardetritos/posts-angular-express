import sharp from 'sharp';

export class SharpUtil {
	public static resizeImage(path: string, size: number, callback: Function) {
		try {
			sharp('./uploads/user-photo.jpg')
				.resize(200)
				.jpeg({ mozjpeg: true })
				.toBuffer()
				.then((data) => {
					callback(data);
				})
				.catch((err) => {
					callback({ error: err });
				});
		} catch (error) {
			callback({ error });
		}
	}
}
