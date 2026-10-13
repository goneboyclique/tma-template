import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

type SwaggerConfig = Partial<{
  title: string;
  description: string;
  version: string;
  tag: string;
}>;

export const makeSwagger = (
  app: INestApplication,
  { title, description, version, tag }: SwaggerConfig = {},
) => {
  const config = new DocumentBuilder()
    .setTitle(title ?? 'Swagger')
    .setDescription(description ?? 'Swagger api description')
    .setVersion(version ?? '1.0')
    .addTag(tag ?? 'swagger')
    // Zod 4 describes a nullable field as `type: ["string", "null"]`, which is
    // only legal from OpenAPI 3.1 on. Under 3.0 that array was mangled into
    // `type: "array"`, so every nullable field reached the generated SDK as
    // `string[]`.
    .setOpenAPIVersion('3.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, cleanupOpenApiDoc(document));
};
