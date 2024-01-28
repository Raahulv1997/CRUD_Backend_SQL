import express from "express";

import fetchuser from "../middleware/auth_by_token.js";
import {
  createTransaction,
  getTransactionDetails,
  getTransactionDetailsBYUserID,
  getTransactionHistory,
} from "../controllers/transactionController.js";

const transactionRouter = express.Router();
transactionRouter.post("/getTransactionHistory", getTransactionHistory);
transactionRouter.post("/getTransactionDetails", getTransactionDetails);
transactionRouter.post(
  "/getTransactionDetailsBYUserID",
  getTransactionDetailsBYUserID
);

transactionRouter.post("/createTransaction", createTransaction);

export default transactionRouter;
