import express from "express";
import {
  RemoveFromCart,
  addToCart,
  getCartByUserID,
  updateCart,
} from "../controllers/cartController.js";

const CartRouter = express.Router();

CartRouter.post("/addToCart", addToCart);
CartRouter.get("/getCartByUserID", getCartByUserID);
CartRouter.put("/updateCart", updateCart);
CartRouter.delete("/RemoveFromCart", RemoveFromCart);

export default CartRouter;
