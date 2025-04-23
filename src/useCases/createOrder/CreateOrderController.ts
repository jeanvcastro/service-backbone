import { BaseController } from "@/infra/http/express/BaseController";
import { CreateOrderUseCase } from "./CreateOrderUseCase";

import { ErrorHandler } from "@/core/ErrorHandler";
import { Request, Response } from "express";
import { CreateOrderInputValidator } from "./CreateOrderInputValidator";

export class CreateOrderController extends BaseController {
  constructor(
    private readonly useCase: CreateOrderUseCase,
    errorHandler: ErrorHandler
  ) {
    super(errorHandler);
  }

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;

      CreateOrderInputValidator.parse(data);

      const result = await this.useCase.execute(data);

      return this.sendJson(response, result);
    } catch (e) {
      return this.sendErrorJson(response, e);
    }
  }
}
