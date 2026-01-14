import client from 'prom-client';

// ============================================
// DEFAULT METRICS (CPU, Memory, GC, etc.)
// ============================================
client.collectDefaultMetrics();

// ============================================
// HTTP METRICS
// ============================================

// Counter: Total HTTP requests
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [client.register],
});

// Histogram: HTTP request duration
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [client.register],
});

// Gauge: HTTP requests in progress
const httpRequestsInProgress = new client.Gauge({
  name: 'http_requests_in_progress',
  help: 'HTTP requests currently being processed',
  labelNames: ['method', 'route'],
  registers: [client.register],
});

// ============================================
// DATABASE METRICS
// ============================================

// Counter: Database operations
const dbOperationsTotal = new client.Counter({
  name: 'db_operations_total',
  help: 'Total database operations',
  labelNames: ['operation', 'collection', 'status'],
  registers: [client.register],
});

// Histogram: Database operation duration
const dbOperationDuration = new client.Histogram({
  name: 'db_operation_duration_seconds',
  help: 'Database operation duration in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
  registers: [client.register],
});

// ============================================
// BUSINESS METRICS (Resume Builder Specific)
// ============================================

// Counter: Resumes created
const resumesCreatedTotal = new client.Counter({
  name: 'resumes_created_total',
  help: 'Total resumes created',
  labelNames: ['template'],
  registers: [client.register],
});

// Counter: Resumes updated
const resumesUpdatedTotal = new client.Counter({
  name: 'resumes_updated_total',
  help: 'Total resumes updated',
  registers: [client.register],
});

// Counter: Resumes deleted
const resumesDeletedTotal = new client.Counter({
  name: 'resumes_deleted_total',
  help: 'Total resumes deleted',
  registers: [client.register],
});

// Counter: User signups
const userSignupsTotal = new client.Counter({
  name: 'user_signups_total',
  help: 'Total user signups',
  registers: [client.register],
});

// Counter: User logins
const userLoginsTotal = new client.Counter({
  name: 'user_logins_total',
  help: 'Total user logins',
  labelNames: ['status'], // success, failure
  registers: [client.register],
});

// Counter: Image uploads
const imageUploadsTotal = new client.Counter({
  name: 'image_uploads_total',
  help: 'Total image uploads',
  labelNames: ['status'], // success, failure
  registers: [client.register],
});

// Gauge: Active resumes
const activeResumesGauge = new client.Gauge({
  name: 'active_resumes',
  help: 'Number of active resumes in the system',
  registers: [client.register],
});

// Gauge: Total users
const totalUsersGauge = new client.Gauge({
  name: 'total_users',
  help: 'Total number of users',
  registers: [client.register],
});

// ============================================
// ERROR METRICS
// ============================================

// Counter: API errors
const apiErrorsTotal = new client.Counter({
  name: 'api_errors_total',
  help: 'Total API errors',
  labelNames: ['endpoint', 'error_type'],
  registers: [client.register],
});

// ============================================
// MIDDLEWARE FOR AUTOMATIC TRACKING
// ============================================

// Middleware to track HTTP requests
const requestMetricsMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const route = req.route?.path || req.path || 'unknown';

  // Increment in-progress counter
  httpRequestsInProgress.inc({ method: req.method, route });

  // Override res.end to track response
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = (Date.now() - startTime) / 1000;

    // Record metrics
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      { method: req.method, route, status: res.statusCode },
      duration
    );

    httpRequestsInProgress.dec({ method: req.method, route });

    // Call original end
    originalEnd.apply(res, args);
  };

  next();
};

// ============================================
// EXPORTS
// ============================================

export {
  client,
  requestMetricsMiddleware,
  // HTTP Metrics
  httpRequestsTotal,
  httpRequestDuration,
  httpRequestsInProgress,
  // Database Metrics
  dbOperationsTotal,
  dbOperationDuration,
  // Business Metrics
  resumesCreatedTotal,
  resumesUpdatedTotal,
  resumesDeletedTotal,
  userSignupsTotal,
  userLoginsTotal,
  imageUploadsTotal,
  activeResumesGauge,
  totalUsersGauge,
  // Error Metrics
  apiErrorsTotal,
};

export const register = client.register;
