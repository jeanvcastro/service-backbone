import { BaseError } from "@/core/domain/errors";
import { ErrorHandler, ErrorResponse } from "@/core/ErrorHandler";
import Logger from "@/core/Logger";
import { isDevelopment } from "@/shared/env";
import { type Response } from "express";
import { ZodError } from "zod";

export class ExpressErrorHandler implements ErrorHandler {
  constructor(private readonly logger: Logger) {}

  public handleError(response: Response, error: unknown, httpCode: number = 400): Response {
    this.logger.error(error);

    if (error instanceof ZodError) {
      return this.handleValidationError(response, error);
    }

    const responseData: ErrorResponse = { message: "Erro inesperado" };
    let isTrustedError = false;

    if (error instanceof BaseError) {
      responseData.code = error.code;
      httpCode = error.httpCode;
      isTrustedError = error.isExpected;
    }

    if (isDevelopment) {
      return this.handleDevelopmentError(response, error, httpCode);
    }

    if (isTrustedError) {
      responseData.message = (error as BaseError).message;
      return response.status(httpCode).json(responseData);
    }

    return response.status(httpCode).json(responseData);
  }

  private handleValidationError(response: Response, error: ZodError): Response {
    const errors = error.issues.reduce((prev: Record<string, string>, issue) => {
      const path = issue.path.join(".");
      return { ...prev, [path]: issue.message };
    }, {});

    return response.status(422).json({
      code: "INVALID_PARAMETERS",
      message: "Parâmetros inválidos",
      errors
    });
  }

  private handleDevelopmentError(response: Response, error: unknown, httpCode: number): Response {
    const responseData: ErrorResponse = { message: "Erro inesperado" };

    if (error instanceof BaseError) {
      responseData.code = error.code;
    }

    if (typeof error === "string") {
      responseData.message = error;
    } else if (error instanceof Error) {
      responseData.message = error.message || "Unknown error";
      responseData.stack = error.stack ? error.stack.split("\n").map(line => line.trim()) : undefined;
    } else if (typeof error === "object") {
      responseData.message = (error as Error)?.message || "Unknown error";
      responseData.details = error;
    }

    return response.status(httpCode).json(responseData);
  }
}
