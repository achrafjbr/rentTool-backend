import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userModel.findOne(
      { email },
      { __v: false },
    );
    return user;
  }

  async me(user: JwtPayloadType) {
    return await this.userModel.findOne({ _id: user.id }, { password: false });
  }

  async updateProfile(
    userPayload: JwtPayloadType,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const user = await this.me(userPayload);
      if (user?.picture) {
        await this.cloudinaryService.deleteImage(user.picturePublicId!);
      }
      const { secure_url, public_id } =
        await this.cloudinaryService.uploadImage(file, 'users');
      updateUserDto.picture = secure_url;
      updateUserDto.picturePublicId = public_id;
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
    return await this.userModel.findOne({ _id: userId }, { password: false });
  }
}
