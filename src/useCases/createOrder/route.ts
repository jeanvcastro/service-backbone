import { Request, Response, Router } from "express";
import { configureDI } from "./di";

const createOrderRouter = Router();

createOrderRouter.post("/orders", async (req: Request, res: Response) => {
  const container = configureDI();
  const controller = container.get("CreateOrderController");
  controller.handle(req, res);
});

export default createOrderRouter;
