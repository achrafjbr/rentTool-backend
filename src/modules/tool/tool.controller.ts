import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/decorators/decorator.authGuard';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { CreateToolDto } from './dtos/create-tool.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ALLOWED_IMAGE_MIMETYPES } from 'src/common/constants/constants';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tool')
@UseGuards(AuthGuard)
export class ToolController {
  @Post('publish_tool')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/tools',
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
  public async publishTool(
    @CurrentUser() user: JwtPayloadType,
    createToolDto: CreateToolDto,
    @UploadedFile() file: Express.Multer.File,
  ) {}

  @Delete(':id')
  public async removeTool(
    @Param() toolId: string,
    @CurrentUser() user: JwtPayloadType,
  ) {}

  @Get(':id')
  public async getTool(@Param() toolId: string) {}

  @Get('tools')
  public async getTools() {}

  @Get('owner_tools')
  public async getOwnerTools(@CurrentUser() user: JwtPayloadType) {}
}
