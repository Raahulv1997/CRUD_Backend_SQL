import express from "express";
import {
  CreateCategory,
  GetAllCategory,
  deleteCategory,
  getCategoryById,
  getCategoryByProductID,
  updateCategory,
} from "../controllers/categoriesController.js";
let categoryRouter = express.Router();

categoryRouter.post("/crearteCategory", CreateCategory);
categoryRouter.get("/allCategory", GetAllCategory);
categoryRouter.get("/getCategoryById", getCategoryById);
categoryRouter.put("/updateCategory", updateCategory);
categoryRouter.delete("/deleteCategory", deleteCategory);
categoryRouter.get("/getCategoryByProductID", getCategoryByProductID);

export default categoryRouter;
