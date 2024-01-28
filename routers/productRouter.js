import express from "express";
import {
  CreateProduct,
  GetAllProduct,
  SearchProuduct,
  addProuductImage,
  getProductById,
  productDeleteById,
  productUpdate,
} from "../controllers/productController.js";

const productRouter = express.Router();
import multer from "multer";
import path from "path";
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload/"); // Specify the destination folder for the zip file
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

productRouter.post("/createproduct", CreateProduct);
productRouter.get("/getallproduct", GetAllProduct);
productRouter.get("/getProductById", getProductById);
productRouter.put("/productUpdate", productUpdate);
productRouter.delete("/productDelete", productDeleteById);
productRouter.get("/SearchProuduct", SearchProuduct);
productRouter.post(
  "/addProuductImage",
  upload.single("productImage"),
  addProuductImage
);

export default productRouter;
