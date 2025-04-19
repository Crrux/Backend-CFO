import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

export class EncryptionUtil {
  private static configService: ConfigService;

  static init(configService: ConfigService) {
    this.configService = configService;
  }

  private static getKey(): string {
    if (!this.configService) {
      throw new Error('EncryptionUtil not initialized with ConfigService');
    }

    // Essayer de lire depuis les secrets Docker d'abord
    try {
      if (fs.existsSync('/run/secrets/encryption_key')) {
        return fs.readFileSync('/run/secrets/encryption_key', 'utf8').trim();
      }
    } catch (error) {
      console.log(
        'No Docker secret found, falling back to environment variable',
      );
    }

    return this.configService.get<string>('ENCRYPTION_KEY');
  }

  static encrypt(data: string): string {
    if (!data) return null;
    return CryptoJS.AES.encrypt(data, this.getKey()).toString();
  }

  static decrypt(encrypted: string): string {
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, this.getKey());
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
