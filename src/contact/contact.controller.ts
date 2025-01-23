import { Body, Controller, Post, Req, Response } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactInterface } from './contact';

@Controller('contact')
export class ContactController {
  constructor(private readonly ContactService: ContactService) {}

  @Post()
  async mailContactForm(
    @Req() request: object,
    @Response() response,
    @Body() body: ContactInterface,
  ) {
    try {
      const mail = await this.ContactService.mailer(body);
      return response.status(200).json({
        message: 'success',
        mail,
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Error sending email',
        error: error.message,
      });
    } finally {
      this.ContactService.contactBddEntry(body);
    }
  }
}
