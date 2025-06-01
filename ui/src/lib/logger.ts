export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  component?: string;
  function?: string;
  transaction?: string;
  address?: string;
  chainId?: number;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  data?: unknown;
}

class Logger {
  private level: LogLevel;
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
    this.level = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    const envLevel = process.env.NEXT_PUBLIC_LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case "DEBUG":
        return LogLevel.DEBUG;
      case "INFO":
        return LogLevel.INFO;
      case "WARN":
        return LogLevel.WARN;
      case "ERROR":
        return LogLevel.ERROR;
      default:
        return process.env.NODE_ENV === "development"
          ? LogLevel.DEBUG
          : LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    data?: unknown,
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.context, ...context },
    };

    if (error) {
      entry.error = error;
    }

    if (data !== undefined) {
      entry.data = data;
    }

    return entry;
  }

  private output(entry: LogEntry): void {
    const levelNames = ["DEBUG", "INFO", "WARN", "ERROR"];
    const levelName = levelNames[entry.level];
    const timestamp = entry.timestamp;

    // Create a readable log line
    let logLine = `[${timestamp}] ${levelName}: ${entry.message}`;

    if (entry.context && Object.keys(entry.context).length > 0) {
      logLine += ` | Context: ${JSON.stringify(entry.context)}`;
    }

    if (entry.data !== undefined) {
      logLine += ` | Data: ${JSON.stringify(entry.data, null, 2)}`;
    }

    if (entry.error) {
      logLine += ` | Error: ${entry.error.message}`;
      if (entry.error.stack) {
        logLine += `\nStack: ${entry.error.stack}`;
      }
    }

    // Output to appropriate console method
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logLine);
        break;
      case LogLevel.INFO:
        console.info(logLine);
        break;
      case LogLevel.WARN:
        console.warn(logLine);
        break;
      case LogLevel.ERROR:
        console.error(logLine);
        break;
    }

    // In development, also output the full structured entry
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(`📋 Structured Log Entry - ${levelName}`);
      console.table(entry);
      console.groupEnd();
    }
  }

  debug(message: string, context?: LogContext, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.output(
        this.formatMessage(LogLevel.DEBUG, message, context, undefined, data),
      );
    }
  }

  info(message: string, context?: LogContext, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.output(
        this.formatMessage(LogLevel.INFO, message, context, undefined, data),
      );
    }
  }

  warn(message: string, context?: LogContext, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.output(
        this.formatMessage(LogLevel.WARN, message, context, undefined, data),
      );
    }
  }

  error(
    message: string,
    error?: Error,
    context?: LogContext,
    data?: unknown,
  ): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.output(
        this.formatMessage(LogLevel.ERROR, message, context, error, data),
      );
    }
  }

  // Create a child logger with additional context
  child(additionalContext: LogContext): Logger {
    return new Logger({ ...this.context, ...additionalContext });
  }

  // Time a function execution
  time<T>(label: string, fn: () => T, context?: LogContext): T {
    const start = performance.now();
    this.debug(`⏱️ Starting: ${label}`, context);

    try {
      const result = fn();
      const duration = performance.now() - start;
      this.debug(`✅ Completed: ${label}`, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
      });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`❌ Failed: ${label}`, error as Error, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
      });
      throw error;
    }
  }

  // Time an async function execution
  async timeAsync<T>(
    label: string,
    fn: () => Promise<T>,
    context?: LogContext,
  ): Promise<T> {
    const start = performance.now();
    this.debug(`⏱️ Starting async: ${label}`, context);

    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.debug(`✅ Completed async: ${label}`, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
      });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`❌ Failed async: ${label}`, error as Error, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
      });
      throw error;
    }
  }

  // Log entry and exit of a function
  trace<T>(
    functionName: string,
    fn: () => T,
    context?: LogContext,
    logArgs?: unknown,
  ): T {
    this.debug(`🔵 Entering: ${functionName}`, context, logArgs);

    try {
      const result = fn();
      this.debug(
        `🟢 Exiting: ${functionName}`,
        context,
        typeof result === "object" ? result : { result },
      );
      return result;
    } catch (error) {
      this.error(`🔴 Error in: ${functionName}`, error as Error, context);
      throw error;
    }
  }

  // Log entry and exit of an async function
  async traceAsync<T>(
    functionName: string,
    fn: () => Promise<T>,
    context?: LogContext,
    logArgs?: unknown,
  ): Promise<T> {
    this.debug(`🔵 Entering async: ${functionName}`, context, logArgs);

    try {
      const result = await fn();
      this.debug(
        `🟢 Exiting async: ${functionName}`,
        context,
        typeof result === "object" ? result : { result },
      );
      return result;
    } catch (error) {
      this.error(`🔴 Error in async: ${functionName}`, error as Error, context);
      throw error;
    }
  }
}

// Create default logger instance
export const logger = new Logger();

// Create component-specific loggers
export const createLogger = (context: LogContext): Logger => {
  return new Logger(context);
};

// Convenience functions for common logging patterns
export const logTransaction = (
  hash: string,
  message: string,
  context?: LogContext,
) => {
  logger.info(`🔗 Transaction: ${message}`, { ...context, transaction: hash });
};

export const logContractCall = (
  contract: string,
  method: string,
  args?: unknown,
  context?: LogContext,
) => {
  logger.debug(
    `📞 Contract call: ${contract}.${method}`,
    { ...context, contract, method },
    args,
  );
};

export const logWalletEvent = (
  event: string,
  address?: string,
  context?: LogContext,
) => {
  logger.info(`👛 Wallet event: ${event}`, { ...context, address, event });
};

export const logUserAction = (action: string, context?: LogContext) => {
  logger.info(`👤 User action: ${action}`, { ...context, action });
};

export const logApiCall = (
  url: string,
  method: string = "GET",
  context?: LogContext,
) => {
  logger.debug(`🌐 API call: ${method} ${url}`, { ...context, url, method });
};

export const logComponentMount = (componentName: string, props?: unknown) => {
  logger.debug(
    `🎭 Component mounted: ${componentName}`,
    { component: componentName },
    props,
  );
};

export const logComponentUnmount = (componentName: string) => {
  logger.debug(`🎭 Component unmounted: ${componentName}`, {
    component: componentName,
  });
};
