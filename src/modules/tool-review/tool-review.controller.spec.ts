import { Test, TestingModule } from '@nestjs/testing';
import { ToolReviewController } from './tool-review.controller';

describe('ToolReviewController', () => {
  let controller: ToolReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolReviewController],
    }).compile();

    controller = module.get<ToolReviewController>(ToolReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
