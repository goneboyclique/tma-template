import { INestApplication } from '@nestjs/common';
import { CORS_ORIGINS } from '../constants/env.constants';

export const setupCors = (app: INestApplication) => {
  app.enableCors({
    origin: CORS_ORIGINS,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
};
