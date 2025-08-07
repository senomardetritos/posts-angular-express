import multer from 'multer';

export class MulterUtil {
	public static createStorageImageFilename(filename: string) {
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'uploads/');
			},
			filename: function (req, file, cb) {
				cb(null, filename);
			},
		});
		return multer({
			storage,
			fileFilter: (req, file, cb) => {
				const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find((formatoAceito) => formatoAceito == file.mimetype);
				if (isAccepted) return cb(null, true);
				else return cb(null, false);
			},
		});
	}
}
