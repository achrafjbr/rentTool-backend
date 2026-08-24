import { HttpException, Injectable } from '@nestjs/common';
import { JwtPayloadType } from 'src/common/types/types.auth';
import { CreateToolDto } from './dtos/create-tool.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tool } from './schemas/schema.tool';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class ToolService {
  constructor(
    @InjectModel(Tool.name) private readonly toolModel: Model<Tool>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  public async publishTool(
    userPayload: JwtPayloadType,
    createToolDto: CreateToolDto,
    file: Express.Multer.File,
  ) {
    try {
      const { secure_url } = await this.cloudinaryService.uploadImage(
        file,
        'tools',
      );

      const tool = await this.toolModel.create({
        ...createToolDto,
        image: secure_url,
        owner: userPayload.id,
      });
      return await tool.populate({
        path: 'owner',
        select: { fullName: 1, city: 1, picture: 1, createdAt: 1 },
      });
    } catch (error) {
      const err = error as UploadApiErrorResponse;
      throw new HttpException(err.message, err.http_code);
    }
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
        select: { fullName: 1, city: 1, picture: 1, createdAt: 1 },
      });
  }

  public async getTools() {
    return await this.toolModel.find({}, { __v: false }).populate({
      path: 'owner',
      select: { fullName: 1, city: 1 },
    });
  }

  public async getToolCities() {
    const cities = await this.toolModel
      .distinct('owner')
      .then((ownerIds) =>
        this.userModel.distinct('city', { _id: { $in: ownerIds } }),
      );
    return cities;
  }

  public async getOwnerTools(userId: string) {
    return await this.toolModel
      .find({ owner: userId }, { __v: false })
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
