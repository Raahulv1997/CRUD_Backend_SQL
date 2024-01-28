import connection from "./Db.js";
import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";

import cors from "cors";
import userRouter from "./routers/userRouter.js";
import walletRouter from "./routers/walletRouter.js";
import PaymentRouter from "./routers/paymentRouter.js";
import transactionRouter from "./routers/transactionRouter.js";
import productRouter from "./routers/productRouter.js";
import productRatingRouter from "./routers/productRatingRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import orderRouter from "./routers/orderRouter.js";
import orderDetailsRouter from "./routers/orderDetailsRouter.js";
import CartRouter from "./routers/cartRouter.js";

const app = express();
connection;
app.use(cors());

app.use(express.json({ limit: "90mb" }));
app.use(express.static("public"));
app.use(bodyParser.json());
// to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// app.use(express.static("public"));
app.use(userRouter);
app.use(walletRouter);
app.use(PaymentRouter);
app.use(productRouter);
app.use(productRatingRouter);
app.use(transactionRouter);
app.use(categoryRouter);
app.use(orderRouter);
app.use(orderDetailsRouter);
app.use(CartRouter);

app.listen(2000, () => {
  console.log(`server is running at ${process.env.SERVERPORT}`);
});
