import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../users/user.entity';

@Injectable()
export class MailService {
  // private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  public async sendUserWelcomeEmail(user: User): Promise<void> {
    // this.logger.log(`Sending welcome email to ${user.email}`);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Our App!',
      template: './welcome',
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:3000/auth/sign-in', // Replace with your actual login URL
      },
    });

    // this.logger.log(`Welcome email sent to ${user.email}`);
  }
}
