export declare const config: {
    nodeEnv: string;
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expiry: string;
    };
    redis: {
        url: string;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        password: string;
        from: string;
    };
    rateLimit: {
        public: number;
        auth: number;
        admin: number;
    };
    ports: {
        authService: number;
        groundsService: number;
        bookingService: number;
        maintenanceService: number;
        notificationService: number;
        apiGateway: number;
        frontend: number;
    };
    services: {
        auth: string;
        grounds: string;
        booking: string;
        maintenance: string;
        notification: string;
    };
};
export declare function validateConfig(): void;
//# sourceMappingURL=config.d.ts.map