import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class PasswordEncryptionService {
  async encrypPassword(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltOrRounds);
  }

  async decrypPassword(
    plainPassword: string,
    hasedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hasedPassword);
  }
}
