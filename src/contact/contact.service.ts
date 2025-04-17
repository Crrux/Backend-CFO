import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import mailer from 'src/environnement/mailer';
import { ConfigService, ConfigType } from '@nestjs/config';
import { SendFormDto } from './interface/send-form.dto';
import { EncryptionUtil } from '../utils/encryption.util';

@Injectable()
export class ContactService implements OnModuleInit {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    @Inject(mailer.KEY)
    private mailerConfig: ConfigType<typeof mailer>,
  ) {}

  onModuleInit() {
    EncryptionUtil.init(this.configService);
  }

  async mailer(body: SendFormDto): Promise<string> {
    try {
      const currentDate = new Date();
      const Reference = `${currentDate.toISOString().replace(/\D/g, '')}${body.firstname[0]}${body.name[0]}${body.tel.slice(-4)}`;
      body.reference = Reference.toUpperCase();
      await this.mailService.sendMail({
        from: `${this.mailerConfig.USERNAME_NAME} <${this.mailerConfig.USERNAME}>`,
        to: `${this.mailerConfig.SUBJECT}`,
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
              <p style="font-size:0.5rem"><span style="font-weight:bold;">Référence:</span> ${body.reference}</p>
            </div>`,
      });
      return 'Email sent';
    } catch (error) {
      console.error(error);
      throw new Error('Error sending email');
    }
  }

  async contactBddEntry(body: SendFormDto): Promise<void> {
    const { name, firstname, email, tel, message, reference } = body;

    // Encrypt sensitive data before saving to database
    const encrypted = {
      name: EncryptionUtil.encrypt(name),
      firstname: EncryptionUtil.encrypt(firstname),
      email: EncryptionUtil.encrypt(email),
      tel: EncryptionUtil.encrypt(tel),
      message: EncryptionUtil.encrypt(message),
      reference,
    };

    await this.contactRepository.save(encrypted);
  }

  // Add a method to get and decrypt contact data
  async getContactById(id: number): Promise<any> {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      return null;
    }

    // Decrypt the data for response
    return {
      id: contact.id,
      name: EncryptionUtil.decrypt(contact.name),
      firstname: EncryptionUtil.decrypt(contact.firstname),
      email: EncryptionUtil.decrypt(contact.email),
      tel: EncryptionUtil.decrypt(contact.tel),
      message: EncryptionUtil.decrypt(contact.message),
      reference: contact.reference,
      created_at: contact.created_at,
    };
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
      reference: contact.reference,
      created_at: contact.created_at,
    }));
  }
}
