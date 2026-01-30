/**
 * Centralized logging utility
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Log an info message
   */
  info(message: string, data?: unknown): void {
    this.log("info", message, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown): void {
    this.log("warn", message, data);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: unknown): void {
    this.log("error", message, error);

    // In production, you might want to send errors to a service like Sentry
    if (!this.isDevelopment && error instanceof Error) {
      // TODO: Send to error tracking service
      // Example: Sentry.captureException(error);
    }
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      this.log("debug", message, data);
    }
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };

    // In development, use console methods with colors
    if (this.isDevelopment) {
      const styles = {
        info: "color: #3B82F6",
        warn: "color: #F59E0B",
        error: "color: #EF4444",
        debug: "color: #8B5CF6",
      };

      console.log(`%c[${level.toUpperCase()}] ${message}`, styles[level]);

      if (data) {
        console.log(data);
      }
    } else {
      // In production, use structured logging
      // You might want to send this to a logging service
      const logMethod = level === "error" ? console.error : console.log;
      logMethod(JSON.stringify(entry));
    }
  }
}

// Export a singleton instance
export const logger = new Logger();
