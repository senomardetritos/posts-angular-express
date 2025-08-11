import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailOptionsInterface } from '../interfaces/mail-interface';

export class MailerController {
	private static transporter: Transporter;

	public static sendEmail(mailOptions: MailOptionsInterface) {
		const smtpOptions: SMTPTransport.Options = {
			host: process.env.MAIL_HOST,
			port: parseInt(process.env.MAIL_PORT ?? '587'),
			secure: true,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASSWORD,
			},
		};
		this.transporter = nodemailer.createTransport(smtpOptions);

		const options = {
			from: `"Posts Angular Express" <${process.env.MAIL_USER}>`,
			...mailOptions,
		};

		this.transporter.sendMail(options, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + options.to);
				console.log(info.response);
			}
		});
	}
}
