import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
// Import Node.js crypto module for randomUUID functionality
import * as nodeCrypto from 'crypto';

// Add only the randomUUID method if it's missing
if (!global.crypto) {
  global.crypto = global.crypto;
}

// Add the randomUUID method that NestJS TypeORM is trying to use
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = function randomUUID() {
    return nodeCrypto.randomUUID();
  };
}

export class EncryptionUtil {
  private static configService: ConfigService;

  static init(configService: ConfigService) {
    this.configService = configService;
  }

  private static getKey(): string {
    if (!this.configService) {
      throw new Error('EncryptionUtil not initialized with ConfigService');
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
