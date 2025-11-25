import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { logger } from '@one-stop-book/common';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function setupSwagger(app: Application): void {
  try {
    // Load OpenAPI spec from contracts directory
    const specPath = path.join(
      __dirname,
      '../../../..',
      'specs/001-ground-booking/contracts/rest-api-gateway.yaml'
    );
    
    if (fs.existsSync(specPath)) {
      const swaggerDocument = yaml.load(fs.readFileSync(specPath, 'utf8'));
      
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument as any, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'One Stop Book API Documentation',
      }));
      
      logger.info('Swagger documentation available at /api-docs');
    } else {
      logger.warn('OpenAPI spec not found, Swagger documentation disabled');
    }
  } catch (error) {
    logger.error('Failed to setup Swagger documentation', { error });
  }
}
