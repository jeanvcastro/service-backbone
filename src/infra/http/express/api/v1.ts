import createOrderRouter from "@/useCases/createOrder/route";
import { Router } from "express";

const v1Router = Router();

v1Router.use(createOrderRouter);

export default v1Router;
