import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllorder,
  getOrderByUserId,
  getSingleOrder,
  orderPlaceNew,
  orderStatusChange,
} from "../controllers/orderController.js";
let orderRouter = express.Router();

orderRouter.post("/createOrder", createOrder);
orderRouter.post("/orderPlaceNew", orderPlaceNew);
orderRouter.get("/getAllorder", getAllorder);
orderRouter.get("/getSingleOrder", getSingleOrder);
orderRouter.put("/orderStatusChange", orderStatusChange);
orderRouter.get("/getOrderByUserId", getOrderByUserId);
orderRouter.delete("/deleteOrder", deleteOrder);

export default orderRouter;
