import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { CreateToolDto } from './dtos/create-tool.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tool } from './schemas/schema.tool';
import { Model } from 'mongoose';

@Injectable()
export class ToolService {
  constructor(
    @InjectModel(Tool.name) private readonly toolModel: Model<Tool>,
  ) {}
  public async publishTool(
    userPayload: JwtPayloadType,
    createToolDto: CreateToolDto,
    file: Express.Multer.File,
  ) {
    return await this.toolModel.create({
      ...createToolDto,
      image: `tools${file.filename}`,
      owner: userPayload.id,
    });
  }

  public async removeTool(toolId: string, userPayload: JwtPayloadType) {
    return await this.toolModel.deleteOne({
      _id: toolId,
      owner: userPayload.id,
    });
  }

  public async getTool(toolId: string) {
    return await this.toolModel.findOne({ _id: toolId }, { __v: false });
  }

  public async getTools() {
    return await this.toolModel.find({}, { __v: false });
  }

  public async getOwnerTools(userPayload: JwtPayloadType) {
    return await this.toolModel
      .find({ owner: userPayload.id }, { __v: false })
      .populate('owner');
  }
}
