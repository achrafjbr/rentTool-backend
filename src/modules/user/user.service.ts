import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userModel.findOne(
      { email },
      { __v: false },
    );
    return user;
  }

  async me(user: JwtPayloadType) {
    return await this.userModel.findOne({ _id: user.id });
  }

  async updateProfile(
    userPayload: JwtPayloadType,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.me(userPayload);

    if (file) {
      if (user?.picture) {
        try {
          await unlink(join(process.cwd(), 'uploads', user.picture));
          file;
        } catch {}
      }

      updateUserDto.picture = `users/${file.filename}`;
    }
    return await this.userModel.findByIdAndUpdate(
      userPayload.id,
      updateUserDto,
      {
        new: true,
        projection: { password: false },
      },
    );
  }

  async getUserById(userId: string) {
    return '';
  }
}
