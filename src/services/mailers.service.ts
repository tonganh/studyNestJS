import { User } from './../users/user.entity';
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
sgMail.setApiKey(
  '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',
);
import * as path from 'path';
import * as ejs from 'ejs';
@Injectable()
export class MailerService {
  private smptp;
  constructor() {
    this.smptp = sgMail;
  }

  public async sendMailResetPassword(user: User) {
    const host = `localhost:3000/reset-password/${user.resetPasswordToken}`;
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, '../../views/forgot-password.ejs'),
      {
        user_firstname: user.email,
        confirm_link: 'http://www.8link.in/confirm=' + user.email,
        reset_token: user.resetPasswordToken,
      },
    );

    const data = {
      to: user.email,
      from: process.env.MAILER_SERVICE_EMAIL,
      subject: 'Reset your account password',
      html: emailTemplate,
    };

    return this.sendEmail(data);
  }
  public async sendEmail(data: {
    to: string;
    from: string;
    subject: string;
    html: string;
  }) {
    const sendEmailPromise = await this.smptp.send(data);

    return sendEmailPromise;
  }
}
