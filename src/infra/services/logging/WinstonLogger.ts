import { BaseError } from "@/domain/errors";
import LoggingService from "@/domain/services/LoggingService";
import { isDevelopment } from "@/shared/env";
import winston, { format, transports, type transport } from "winston";
import { ZodError } from "zod";

export default class WinstonLogger implements LoggingService {
  winstonLogger: winston.Logger;

  constructor() {
    const logLevel = process.env.LOG_LEVEL ?? "debug";

    const logColors: Record<string, string> = {
      debug: "gray",
      info: "cyan",
      warn: "yellow",
      error: "red",
      fatal: "magenta"
    };

    winston.addColors(logColors);

    const customFormat = format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.errors({ stack: true }),
      format.printf(({ timestamp, level, message, ...meta }) => {
        const upperLevel = level.toUpperCase();
        const metaData = Object.keys(meta).length ? meta : null;

        if (typeof message === "string" && !metaData) {
          return `[${timestamp}] ${upperLevel}: ${message}`;
        }

        const jsonMeta = isDevelopment
          ? JSON.stringify({ message, ...metaData }, null, 2)
          : JSON.stringify({ message, ...metaData });

        return `[${timestamp}] ${upperLevel}: ${jsonMeta}`;
      }),
      ...(isDevelopment ? [format.colorize({ all: true })] : [])
    );

    const loggerTransports: transport[] = [
      new transports.Console({
        format: customFormat,
        level: logLevel
      })
    ];

    this.winstonLogger = winston.createLogger({
      level: logLevel,
      transports: loggerTransports
    });
  }

  private winstonLogMap(data: unknown, level: string = "info") {
    const formatStack = (stack?: string) =>
      !isDevelopment && stack ? stack.split("\n").map(line => line.trim()) : undefined;

    if (data instanceof BaseError) {
      const { code, message, isExpected, httpCode, internalReason, context, stack } = data;
      return { level, code, message, isExpected, httpCode, internalReason, context, stack: formatStack(stack) };
    }

    if (data instanceof ZodError) {
      const { message, issues } = data;
      return { level, message, issues };
    }

    if (data instanceof Error) {
      const { message, stack } = data;
      return { level, message, stack: formatStack(stack) };
    }

    return { level, message: data };
  }

  debug(logData: unknown) {
    this.winstonLogger.debug(this.winstonLogMap(logData, "debug"));
  }

  info(logData: unknown) {
    this.winstonLogger.info(this.winstonLogMap(logData, "info"));
  }

  warn(logData: unknown) {
    this.winstonLogger.warn(this.winstonLogMap(logData, "warn"));
  }

  error(logData: unknown) {
    this.winstonLogger.error(this.winstonLogMap(logData, "error"));
  }

  fatal(logData: unknown) {
    this.winstonLogger.error(this.winstonLogMap(logData, "fatal"));
  }
}
