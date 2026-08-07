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
  Body,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/decorators/decorator.authGuard';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { CreateToolDto } from './dtos/create-tool.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ALLOWED_IMAGE_MIMETYPES } from 'src/common/constants/constants';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ToolService } from './tool.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}
  @Post('publish_tool')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/tools',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
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
        fieldSize: 2 * 1024 * 1024,
      },
    }),
  )
  public async publishTool(
    @CurrentUser() userPayload: JwtPayloadType,
    @Body() createToolDto: CreateToolDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Should upload tool image');
    }
    return await this.toolService.publishTool(userPayload, createToolDto, file);
  }

  // Home page tool.
  @Get('owner/tools')
  @UseGuards(AuthGuard)
  public async getAllToolsWithOwners(
    @CurrentUser() userPayload: JwtPayloadType,
  ) {
    return await this.toolService.getAllToolsWithOwners(userPayload);
  }

  @Get('my-tools')
  @UseGuards(AuthGuard)
  public async getOwnerTools(@CurrentUser() userPayload: JwtPayloadType) {
    return await this.toolService.getOwnerTools(userPayload);
  }

  @Get('cities')
  public async getToolCities() {
    return await this.toolService.getToolCities();
  }

  @Delete(':toolId')
  @UseGuards(AuthGuard)
  public async removeTool(
    @Param('toolId', ParseObjectIdPipe) toolId: string,
    @CurrentUser() userPayload: JwtPayloadType,
  ) {
    return await this.toolService.removeTool(toolId, userPayload);
  }

  @Get(':toolId')
  @UseGuards(AuthGuard)
  public async getTool(@Param('toolId', ParseObjectIdPipe) toolId: string) {
    console.log('Here');
    return await this.toolService.getTool(toolId);
  }

  @Get()
  public async getTools() {
    return await this.toolService.getTools();
  }
}
