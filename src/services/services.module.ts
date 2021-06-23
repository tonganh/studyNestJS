import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailers.service';

@Global()
@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class ServiceModule {}
