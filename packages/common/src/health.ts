// Health check endpoint template for microservices

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

export async function performHealthCheck(
  serviceName: string,
  version: string,
  checker: HealthChecker
): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: serviceName,
    version,
    checks: {},
  };
  
  // Check database connection if applicable
  if (checker.checkDatabase) {
    try {
      const dbHealthy = await checker.checkDatabase();
      result.checks.database = dbHealthy ? 'connected' : 'disconnected';
      if (!dbHealthy) result.status = 'unhealthy';
    } catch (error) {
      result.checks.database = 'disconnected';
      result.status = 'unhealthy';
    }
  }
  
  // Check dependencies if applicable
  if (checker.checkDependencies) {
    try {
      const deps = await checker.checkDependencies();
      result.checks.dependencies = {};
      for (const [name, isUp] of Object.entries(deps)) {
        result.checks.dependencies[name] = isUp ? 'up' : 'down';
        if (!isUp) result.status = 'unhealthy';
      }
    } catch (error) {
      result.status = 'unhealthy';
    }
  }
  
  return result;
}
