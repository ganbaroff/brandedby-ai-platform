// Sentry Error Tracking Configuration
// File: src/react-app/sentry.config.ts
// Purpose: Centralized Sentry initialization for error tracking and monitoring

// No-op Sentry wrapper
// Replaces Sentry usage during cleanup to avoid importing @sentry packages
// and to prevent MCP integrations from being loaded at runtime.

export const initSentry = (): void => {
  // intentionally empty
};

export const captureException = (
  _error: unknown,
  _context?: Record<string, unknown>
): void => {
  if (import.meta.env.PROD) return;
  // In dev, still log to console for visibility
  // eslint-disable-next-line no-console
  console.error('captureException called (noop):', _error, _context);
};

export const captureMessage = (
  _message: string,
  _level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info'
): void => {
  if (import.meta.env.PROD) return;
  // eslint-disable-next-line no-console
  console.log('captureMessage (noop):', _level, _message);
};

export const addBreadcrumb = (
  _message: string,
  _data?: Record<string, unknown>,
  _level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info'
): void => {
  if (import.meta.env.PROD) return;
  // eslint-disable-next-line no-console
  console.debug('breadcrumb (noop):', _level, _message, _data);
};

export const setUserContext = (
  _userId?: string,
  _email?: string,
  _name?: string
): void => {
  // no-op
};

export const clearUserContext = (): void => {
  // no-op
};

export const captureVideoGenerationMetrics = (
  _projectId: string,
  _celebrity: string,
  _duration: number,
  _success: boolean,
  _error?: string
): void => {
  // no-op
};

export const capturePaymentMetrics = (
  _amount: number,
  _currency: string,
  _paymentMethod: string,
  _success: boolean,
  _error?: string
): void => {
  // no-op
};

const noopDefault = {
  initSentry,
  captureException,
  captureMessage,
  addBreadcrumb,
  setUserContext,
  clearUserContext,
  captureVideoGenerationMetrics,
  capturePaymentMetrics,
};

export default noopDefault;
