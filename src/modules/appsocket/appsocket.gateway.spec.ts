import { Test, TestingModule } from '@nestjs/testing';
import { AppsocketGateway } from './appsocket.gateway';

describe('AppsocketGateway', () => {
  let gateway: AppsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppsocketGateway],
    }).compile();

    gateway = module.get<AppsocketGateway>(AppsocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
