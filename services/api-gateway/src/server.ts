import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config, logger, validateConfig } from '@one-stop-book/common';
import { errorHandler } from './middleware/error-handler';
import { setupRoutes } from './routes';
import { setupSwagger } from './swagger';

export class ApiGatewayServer {
  private app: Application;
  private port: number;
  
  constructor() {
    this.app = express();
    this.port = config.ports.apiGateway;
    this.initialize();
  }
  
  private initialize(): void {
    // Validate configuration
    validateConfig();
    
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration - allow frontend origin
    const allowedOrigins = [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:3000',
      process.env.CORS_ORIGIN,
    ].filter(Boolean);
    
    this.app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn(`CORS blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      maxAge: 600, // 10 minutes
    }));
    
    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      next();
    });
    
    // Setup Swagger documentation
    setupSwagger(this.app);
    
    // Setup API routes
    setupRoutes(this.app);
    
    // Error handling middleware (must be last)
    this.app.use(errorHandler);
  }
  
  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`API Gateway started on port ${this.port}`, {
        environment: config.nodeEnv,
        port: this.port,
      });
    });
  }
  
  public getApp(): Application {
    return this.app;
  }
}

// Start server if running directly
if (require.main === module) {
  const server = new ApiGatewayServer();
  server.start();
}
