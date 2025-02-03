import { Inject, Injectable } from '@nestjs/common';
import { ContactInterface } from './contact';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from 'src/config/config.service';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import mailer from 'src/environnement/mailer';
import { ConfigType } from '@nestjs/config';
import { SendFormDto } from './interface/send-form.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private readonly mailService: MailerService,
    @Inject(mailer.KEY)
    private mailerConfig: ConfigType<typeof mailer>,
  ) {}

  async mailer(body: SendFormDto): Promise<void> {
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
  }

  async contactBddEntry(body: SendFormDto): Promise<void> {
    const { name, firstname, email, tel, message, reference } = body;
    const test = { name, firstname, email, tel, message, reference };
    await this.contactRepository.save(test);
  }
}
