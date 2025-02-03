import { Body, Controller, Post, Req, Response } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactInterface } from './contact';
import { SendFormDto } from './interface/send-form.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly ContactService: ContactService) {}

  @Post()
  async mailContactForm(@Response() response, @Body() body: SendFormDto) {
    try {
      await Promise.all([
        this.ContactService.mailer(body),
        this.ContactService.contactBddEntry(body),
      ]);
      return response.status(200).json({
        message: 'success',
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Error sending email',
        error: error.message,
      });
    }
  }
}
