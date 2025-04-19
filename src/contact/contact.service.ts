import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import mailer from 'src/environnement/mailer';
import { ConfigService, ConfigType } from '@nestjs/config';
import { SendFormDto } from './interface/send-form.dto';
import { EncryptionUtil } from '../utils/encryption.util';
import * as fs from 'fs';

@Injectable()
export class ContactService implements OnModuleInit {
  private mailerSubject: string;

  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    @Inject(mailer.KEY)
    private mailerConfig: ConfigType<typeof mailer>,
  ) {
    this.mailerSubject = this.mailerConfig.SUBJECT;
    try {
      if (fs.existsSync('/run/secrets/mailer_subject')) {
        this.mailerSubject = fs
          .readFileSync('/run/secrets/mailer_subject', 'utf8')
          .trim();
      }
    } catch (error) {
      console.log(
        'No Docker secret found for mailer subject, using environment variable',
      );
    }
  }

  onModuleInit() {
    EncryptionUtil.init(this.configService);
  }

  async mailer(body: SendFormDto): Promise<string> {
    try {
      let username = this.mailerConfig.USERNAME;
      try {
        if (fs.existsSync('/run/secrets/mailer_username')) {
          username = fs
            .readFileSync('/run/secrets/mailer_username', 'utf8')
            .trim();
        }
      } catch (error) {
        console.log(error);
      }

      await this.mailService.sendMail({
        from: `${this.mailerConfig.USERNAME_NAME} <${username}>`,
        to: `${this.mailerSubject}`,
        subject: `Formulaire CFO`,
        html: `
            <div>
              <h1 style="color:red;">Formulaire Site CrossfitObernai</h1>
              <p><span style="font-weight:bold; margin: 0; padding: 0;">Nom / Prenom:</span><p>
              <pre>${body.name.charAt(0).toUpperCase() + body.name.slice(1).toLowerCase()} ${body.firstname.charAt(0).toUpperCase() + body.firstname.slice(1).toLowerCase()}</pre>
              <p><span style="font-weight:bold; margin: 0; padding: 0;">Email:</span> </p>
              <pre>${body.email}</pre>
              <p><span style="font-weight:bold; margin: 0; padding: 0;">Téléphone:</span></p>
              <pre>${body.tel}</pre>
              <p><span style="font-weight:bold; margin: 0; padding: 0;">Message:</span> </p>
              <pre>${body.message}</pre>
            </div>`,
      });
      return 'Email sent';
    } catch (error) {
      console.error('Mail service error:', error);
      throw new Error(`Error sending email: ${error.message}`);
    }
  }

  async contactBddEntry(body: SendFormDto): Promise<void> {
    try {
      const { name, firstname, email, tel, message } = body;

      // Encrypt sensitive data before saving to database
      const encrypted = {
        name: EncryptionUtil.encrypt(name),
        firstname: EncryptionUtil.encrypt(firstname),
        email: EncryptionUtil.encrypt(email),
        tel: EncryptionUtil.encrypt(tel),
        message: EncryptionUtil.encrypt(message),
      };

      await this.contactRepository.save(encrypted);
    } catch (error) {
      console.error('Database entry error:', error);
      throw new Error(`Error saving to database: ${error.message}`);
    }
  }

  // Method to get all contacts with decryption
  async getAllContacts(): Promise<any[]> {
    const contacts = await this.contactRepository.find();

    return contacts.map((contact) => ({
      id: contact.id,
      name: EncryptionUtil.decrypt(contact.name),
      firstname: EncryptionUtil.decrypt(contact.firstname),
      email: EncryptionUtil.decrypt(contact.email),
      tel: EncryptionUtil.decrypt(contact.tel),
      message: EncryptionUtil.decrypt(contact.message),
      created_at: this.convertUTCToLocalTime(contact.created_at),
    }));
  }

  private convertUTCToLocalTime(utcDate: Date): string {
    if (!utcDate) return '';
    const localDate = new Date(utcDate);
    return localDate.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
