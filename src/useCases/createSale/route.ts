import { Request, Response, Router } from "express";
import { configureDI } from "./di";

const createSaleRouter = Router();

createSaleRouter.post("/sales", async (req: Request, res: Response) => {
  const container = configureDI();
  const controller = container.get("CreateSaleController");
  controller.handle(req, res);
});

export default createSaleRouter;
