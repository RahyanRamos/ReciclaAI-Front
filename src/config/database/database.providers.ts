import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DATABASE_SOURCE } from '../constants/database-source';

const toBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
};

export const databaseProviders = [
  {
    provide: DATABASE_SOURCE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<DataSource> => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'reciclaai_front'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: toBoolean(
          configService.get<string>('DB_SYNCHRONIZE', 'false'),
          false,
        ),
        logging: toBoolean(
          configService.get<string>('DB_LOGGING', 'false'),
          false,
        ),
      });

      try {
        return await dataSource.initialize();
      } catch (error) {
        Logger.error(
          'Falha ao conectar no MySQL. A aplicacao continuara ativa, mas as rotas de banco poderao ficar indisponiveis.',
          error instanceof Error ? error.message : String(error),
          'DatabaseProvider',
        );

        return dataSource;
      }
    },
  },
];
