import express from "express";

import fetchuser from "../middleware/auth_by_token.js";
import {
  addFunds,
  createWallet,
  sendMoney,
  showAllWallet,
  withdrawFunds,
} from "../controllers/walletControllers.js";
// import { getUserBalance } from "../controllers/walletControllers.js";

const walletRouter = express.Router();
walletRouter.post("/addMoney", addFunds);
walletRouter.post("/sendMoney", sendMoney);
walletRouter.post("/withdrawFunds", withdrawFunds);
walletRouter.post("/createWallet", createWallet);
walletRouter.get("/showAllWallet", showAllWallet);

export default walletRouter;
