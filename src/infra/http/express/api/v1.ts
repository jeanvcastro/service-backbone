import createSaleRouter from "@/useCases/createSale/route";
import { Router } from "express";

const v1Router = Router();

v1Router.use(createSaleRouter);

export default v1Router;
