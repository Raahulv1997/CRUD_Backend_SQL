import express from "express";

import { Payment, Verify } from "../controllers/paymentController.js";

const PaymentRouter = express.Router();
PaymentRouter.post("/Payment", Payment);
PaymentRouter.post("/verify", Verify);

export default PaymentRouter;
