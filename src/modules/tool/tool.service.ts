import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { CreateToolDto } from './dtos/create-tool.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tool } from './schemas/schema.tool';
import { Model, ObjectId } from 'mongoose';

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
    return await this.toolModel
      .findOne({ _id: toolId }, { __v: false })
      .populate({
        path: 'owner',
        select: { fullName: 1, city: 1 },
      });
  }

  public async getTools() {
    return await this.toolModel.find({}, { __v: false }).populate({
      path: 'owner',
      select: { fullName: 1, city: 1 },
    });
  }

  public async getOwnerTools(userPayload: JwtPayloadType) {
    return await this.toolModel
      .find({ owner: userPayload.id }, { __v: false })
      .populate('owner');
  }

  public async getAllToolsWithOwners(userPayload: JwtPayloadType) {
    // Getting tool with it's owner and excluding the current user Tools
    console.log('id', userPayload.id);
    return await this.toolModel
      .find({ owner: { $ne: userPayload.id } })
      .populate({
        path: 'owner',
        select: { fullName: 1, city: 1 },
      });
  }
}
