import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Users } from './entity/users.entity';

export const DbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (configService: ConfigService) => {
      const datasource = new DataSource({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: configService.get('DATABASE_SYNCHRONIZE'),
        entities: [Users],
        logging: false,
      });
      const db = await datasource.initialize();
      console.log('Connected');
      return db;
    },
    inject: [ConfigService],
  },
];
