import express from "express";
import {
  createUsers,
  getTesting,
  getUserBalance,
  get_all_user,
  update_user,
  userDeleteById,
  user_details,
  user_login,
  user_login_new,
  user_otp_verify,
} from "../controllers/usersController.js";

import fetchuser from "../middleware/auth_by_token.js";

const userRouter = express.Router();
userRouter.post("/crearte_users", createUsers);
userRouter.post("/userlogin", user_login);
userRouter.get("/allUser", get_all_user);
userRouter.post("/userDetails", user_details);
userRouter.put("/update_user", fetchuser, update_user);
userRouter.post("/getUserBalance", getUserBalance);
userRouter.post("/testingAPI", getTesting);
userRouter.post("/userloginNew", user_login_new);
userRouter.post("/otpVerification", user_otp_verify);
userRouter.delete("/deleteUserById", userDeleteById);

export default userRouter;
