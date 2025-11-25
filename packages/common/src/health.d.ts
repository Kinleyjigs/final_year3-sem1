export interface HealthCheckResult {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    service: string;
    version: string;
    checks: {
        database?: 'connected' | 'disconnected';
        dependencies?: Record<string, 'up' | 'down'>;
    };
}
export interface HealthChecker {
    checkDatabase?: () => Promise<boolean>;
    checkDependencies?: () => Promise<Record<string, boolean>>;
}
export declare function performHealthCheck(serviceName: string, version: string, checker: HealthChecker): Promise<HealthCheckResult>;
//# sourceMappingURL=health.d.ts.map