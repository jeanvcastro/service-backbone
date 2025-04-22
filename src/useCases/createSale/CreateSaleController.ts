import { BaseController } from "@/infra/http/express/BaseController";
import { CreateSaleUseCase } from "./CreateSaleUseCase";

import { ErrorHandler } from "@/core/ErrorHandler";
import { Request, Response } from "express";
import { CreateSaleInputValidator } from "./CreateSaleInputValidator";

export class CreateSaleController extends BaseController {
  constructor(
    private readonly useCase: CreateSaleUseCase,
    errorHandler: ErrorHandler
  ) {
    super(errorHandler);
  }

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body;

      CreateSaleInputValidator.parse(data);

      const result = await this.useCase.execute(data);

      return this.sendJson(response, result);
    } catch (e) {
      return this.sendErrorJson(response, e);
    }
  }
}
