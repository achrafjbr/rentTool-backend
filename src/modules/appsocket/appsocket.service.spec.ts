import { Test, TestingModule } from '@nestjs/testing';
import { AppsocketService } from './appsocket.service';

describe('AppsocketService', () => {
  let service: AppsocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppsocketService],
    }).compile();

    service = module.get<AppsocketService>(AppsocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
