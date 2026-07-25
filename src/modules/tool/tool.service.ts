import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from 'src/common/types/types.auth';

@Injectable()
export class ToolService {
  public async publishTool(user: JwtPayloadType) {}

  public async removeTool(toolId: string, user: JwtPayloadType) {}

  public async getTool(toolId: string) {}

  public async getTools() {}

  public async getOwnerTools(user: JwtPayloadType) {}
}
