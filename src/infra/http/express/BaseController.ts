import { ErrorHandler } from "@/shared/kernel/ErrorHandler";
import { type Response } from "express";
import { objectToSnake } from "ts-case-convert";

export abstract class BaseController {
  constructor(private readonly errorHandler: ErrorHandler) {}

  public sendJson<T>(response: Response, data: T, httpCode: number = 200): Response {
    if (typeof data === "string") {
      return response.status(httpCode).json({ message: data });
    }

    if (typeof data === "object") {
      return response.status(httpCode).json(objectToSnake(data as object));
    }

    return response.status(httpCode).json(data);
  }

  public sendErrorJson(response: Response, error: unknown, httpCode: number = 400): Response {
    return this.errorHandler.handleError(response, error, httpCode);
  }
}
