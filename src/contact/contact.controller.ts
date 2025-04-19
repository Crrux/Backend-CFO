import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { ContactService } from './contact.service';
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
        message: 'error:',
        error: error.message,
      });
    }
  }

  @Get()
  async getAllContacts(@Response() response) {
    try {
      const contacts = await this.ContactService.getAllContacts();
      return response.status(200).json(contacts);
    } catch (error) {
      return response.status(500).json({
        message: 'Error retrieving contacts',
        error: error.message,
      });
    }
  }
}
