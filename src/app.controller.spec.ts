import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('deve retornar status da aplicacao', () => {
    const response = appController.status();

    expect(response).toEqual(
      expect.objectContaining({
        status: 'ok',
        app: 'reciclaai-front',
      }),
    );
  });
});
