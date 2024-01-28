import express from "express";
import {
  createOrderDetails,
  getOrderDetailsByOrderId,
} from "../controllers/orderDetailsController.js";

let orderDetailsRouter = express.Router();

orderDetailsRouter.post("/createOrderDetails", createOrderDetails);
orderDetailsRouter.get("/getOrderDetailsByOrderId", getOrderDetailsByOrderId);

export default orderDetailsRouter;
