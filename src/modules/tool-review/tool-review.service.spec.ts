import { Test, TestingModule } from '@nestjs/testing';
import { ToolReviewService } from './tool-review.service';

describe('ToolReviewService', () => {
  let service: ToolReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToolReviewService],
    }).compile();

    service = module.get<ToolReviewService>(ToolReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
