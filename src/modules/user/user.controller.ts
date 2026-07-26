import {
  Controller,
  Get,
  Body,
  Patch,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/common/decorators/decorator.authGuard';
import { ALLOWED_IMAGE_MIMETYPES } from 'src/common/constants/constants';
import { extname, join } from 'path';
import { unlink } from 'fs/promises';
import { cwd } from 'process';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  me(@CurrentUser() user: JwtPayloadType) {
    return this.userService.me(user);
  }

  @Get()
  getUserById(userId: string) {
    return this.userService.getUserById(userId);
  }

  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)} ${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
          cb(new BadRequestException('Only image allowed'), false);
        }

        cb(null, true);
      },
      limits: {
        fieldSize: 1024 * 1024 * 2,
      },
    }),
  )
  async updateProfile(
    @CurrentUser() userPayload: JwtPayloadType,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.userService.updateProfile(
      userPayload,
      updateUserDto,
      file,
    );
  }
}
