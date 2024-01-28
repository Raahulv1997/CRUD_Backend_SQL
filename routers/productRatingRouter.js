import express from "express";
import {
  AddProductReview,
  DeleteRating,
  UpdateRating,
  getProductReviewByProductId,
} from "../controllers/productRatingController.js";

const productRatingRouter = express.Router();

productRatingRouter.post("/createproductRating", AddProductReview);
productRatingRouter.get(
  "/getProductReviewByProductId",
  getProductReviewByProductId
);
productRatingRouter.put("/updateRating", UpdateRating);
productRatingRouter.delete("/DeleteRating", DeleteRating);

export default productRatingRouter;
