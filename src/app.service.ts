import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'ok',
      app: 'reciclaai-front',
      dominio: 'administracao-reciclagens',
      timestamp: new Date().toISOString(),
    };
  }
}
