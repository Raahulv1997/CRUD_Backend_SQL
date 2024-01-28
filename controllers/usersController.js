import connection from "../Db.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import axios from "axios";
import nodemailer from "nodemailer";

export const createUsers = async (req, res) => {
  var loginID = Math.floor(100000 + Math.random() * 900000);
  var { admin_id, name, role, mobile, email, password, address, pincode } =
    req.body;
  const salt = await bcrypt.genSalt(10);
  const password_salt = await bcrypt.hash(password, salt);
  connection.query(
    "SELECT * FROM `user` WHERE `email`='" + email + "'",
    (err, rows) => {
      if (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        if (rows == "") {
          WellcomeMobile(mobile, name);
          WellcomeEmail(email, name);
          // testingmailer(email, loginID);
          connection.query(
            "insert into user  (`admin_id`,`name`,`role`, `mobile`,`email`,`password`,`address`,`pincode`,`loginID`) VALUES('" +
              admin_id +
              "','" +
              name +
              "','" +
              role +
              "', '" +
              mobile +
              "','" +
              email +
              "', '" +
              password_salt +
              "','" +
              address +
              "', '" +
              pincode +
              "','" +
              loginID +
              "' ) ",
            (err, rows) => {
              if (err) {
                res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ message: err });
              } else {
                connection.query(
                  "insert into wallets  (`user_id`,`walletHolder`) VALUES('" +
                    rows.insertId +
                    "','" +
                    name +
                    "' ) ",
                  (err, rows) => {
                    if (err) {
                      res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ message: err });
                    } else {
                      res
                        .status(StatusCodes.OK)
                        .json({ message: "User and wallet Created" });
                    }
                  }
                );
              }
            }
          );
        } else {
          res
            .status(StatusCodes.OK)
            .json({ message: "already added this email" });
        }
      }
    }
  );
};

export const user_login = async (req, res) => {
  var { email, password } = req.body;

  if (email && password) {
    connection.query(
      'SELECT `user_id`,`loginID`,`role`,`name`, `email` , `password` FROM `user`  WHERE `email` ="' +
        email +
        '"  ',
      async (err, results) => {
        if (err) {
          //console.log(err)
          res.send(err);
        } else {
          if (results != "") {
            //__________bcrypt_____________________________________

            var db_psw = JSON.parse(JSON.stringify(results[0].password));
            // //console.log(typeof psw)
            const validPassword = await bcrypt.compare(password, db_psw);

            if (validPassword) {
              jwt.sign(
                { id: results[0].user_id },
                process.env.ADMIN_JWT_SECRET_KEY,
                function (err, token) {
                  //console.log(token);
                  if (err) {
                  }
                  res.send({
                    resCode: "101",
                    userDetail: results,
                    status: true,
                    token: token,
                  });
                }
              );
            } else {
              res.send({ resCode: "102", message: "password not matched" });
            }
          } else {
            res.send({ resCode: "103", message: "Email not found" });
          }
        }
      }
    );
  } else {
    res.send({ resCode: "104", message: "please fill input" });
  }
};

export const get_all_user = async (req, res) => {
  connection.query("select * from user ", (err, rows) => {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "something went wrong" });
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
};

export const user_details = async (req, res) => {
  var { id } = req.body;
  connection.query(
    "select * from user where user_id= '" + id + "'",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
};

export const update_user = async (req, res) => {
  var {
    admin_id,
    user_id,
    name,
    role,
    mobile,
    email,
    password,
    address,
    pincode,
  } = req.body;

  const salt = await bcrypt.genSalt(10);
  const password_salt = await bcrypt.hash(password, salt);

  connection.query(
    "select * from user where user_id= '" + req.user + "'",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        let UpdateValue = JSON.stringify({
          id: rows[0].user_id,
          name: rows[0].name,
          role: rows[0].role,
        });
        connection.query(
          "UPDATE `user` SET `admin_id`='" +
            admin_id +
            "',`role`='" +
            role +
            "',`name`='" +
            name +
            "',`mobile`='" +
            mobile +
            "',`email`='" +
            email +
            "',`password`='" +
            password_salt +
            "',`updated_by`='" +
            UpdateValue +
            "',`address`='" +
            address +
            "', `pincode`= '" +
            pincode +
            "' WHERE user_id='" +
            user_id +
            "' ",
          (err, rows) => {
            if (err) {
              res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: err });
            } else {
              res
                .status(StatusCodes.OK)
                .json({ message: "user updated successfully" });
            }
          }
        );
      }
    }
  );
};

export const getUserBalance = (req, res) => {
  var { user_id } = req.body;

  connection.query(
    "SELECT * FROM wallets WHERE user_id = ?",
    [user_id],
    (err, userWallet) => {
      if (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(userWallet);
      }
    }
  );
};

export const getTesting = async (req, res) => {
  var { user_id } = req.body;
  var mobile = "918269364180";
  var email = "raahulverma106@gmail.com";
  var otp = Math.floor(100000 + Math.random() * 900000);
  let re = await testimg(mobile, otp);
  let em = await testingmailer(email, otp);
  console.log("resss--" + JSON.stringify(re, em));

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: re, msg2: em });
  return false;
  connection.query(
    "SELECT * FROM wallets WHERE user_id = ?",
    [user_id],
    (err, userWallet) => {
      if (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(userWallet);
      }
    }
  );
};

const testimg = async (mobile, otp) => {
  let data = JSON.stringify({
    number: `91${mobile}`,
    type: "text",
    message: `Your OTP for your login is ${otp}`,
    instance_id: "6564604E07291",
    access_token: "65645fffbb13a",
  });

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://niyochat.com/api/send",
    headers: {
      "Content-Type": "application/json",
      Cookie: "stackpost_session=ougj052rv7crkapr3qachgqgl7c2i2q7",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    // console.log("Response:", response.data);
    return response.data; // You can return the data or do something else with it
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error or handle it accordingly
  }
};

async function testingmailer(email, otp) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "niyoinrahulverma@gmail.com",
      pass: "hkzggozdbkajzfak",
    },
  });
  let mailDetails = {
    from: "niyoinrahulverma@gmail.com",
    to: `${email}`,
    subject: "Registration for E-wallet",
    html: `<b>Hello,</b> <p>Here is the OTP of ${otp}</p>`,
  };
  mailTransporter.sendMail(mailDetails, async function (err, data) {
    if (err) {
      return err;
    } else {
      return "success";
    }
  });
}

const WellcomeMobile = async (mobile, name) => {
  let data = JSON.stringify({
    number: `91${mobile}`,
    type: "text",
    message: `Welcome ${name}! We're thrilled to have you join the DigiWallet family. Your new account is now all set up and ready to simplify your financial transactions.

    With DigiWallet, you're stepping into a world of convenience and security. Whether you're sending money, paying bills, or managing your finances, we're here to make it effortless for you`,
    instance_id: "6564604E07291",
    access_token: "65645fffbb13a",
  });

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://niyochat.com/api/send",
    headers: {
      "Content-Type": "application/json",
      Cookie: "stackpost_session=ougj052rv7crkapr3qachgqgl7c2i2q7",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);

    return response.data; // You can return the data or do something else with it
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error or handle it accordingly
  }
};

async function WellcomeEmail(email, name) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "niyoinrahulverma@gmail.com",
      pass: "hkzggozdbkajzfak",
    },
  });
  let mailDetails = {
    from: "niyoinrahulverma@gmail.com",
    to: `${email}`,
    subject: "Wellcome in Digi-Wallet",
    html: ` <h1>Welcome to Digi-Wallet!</h1>
    <p>Dear ${name},</p>
    <p>Welcome aboard! We're thrilled to have you join the Digi-Wallet family. Your new account is now all set up
        and ready to simplify your financial transactions.</p>
    <p>With Digi-Wallet, you're stepping into a world of convenience and security. Whether you're sending money,
        paying bills, or managing your finances, we're here to make it effortless for you.</p>
    <p>Here are a few things you can do right away:</p>
    <ol>
        <li><strong>Explore Your Dashboard</strong>: Take a tour of your account dashboard to familiarize yourself with
            our features.</li>
        <li><strong>Add Funds</strong>: Start by adding funds to your wallet for seamless transactions.</li>
        <li><strong>Security Check</strong>: Ensure your account's security by setting up necessary authentication
            methods.</li>
    </ol>
  
    <p>Thank you for choosing Digi-wallet! We look forward to being your go-to platform for all your financial
        needs.</p>
    <p>Warm regards</p>`,
  };
  mailTransporter.sendMail(mailDetails, async function (err, data) {
    if (err) {
      return err;
    } else {
      return "success";
    }
  });
}

export const user_login_new = async (req, res) => {
  var otp = Math.floor(100000 + Math.random() * 900000);
  var { email, password } = req.body;

  if (email && password) {
    connection.query(
      'SELECT `user_id`,`name`, `email`,`mobile`,`password` FROM `user`  WHERE `email` ="' +
        email +
        '"  ',
      async (err, results) => {
        if (err) {
          //console.log(err)
          res.send(err);
        } else {
          if (results != "") {
            //__________bcrypt_____________________________________

            var db_psw = JSON.parse(JSON.stringify(results[0].password));
            // //console.log(typeof psw)
            const validPassword = await bcrypt.compare(password, db_psw);

            if (validPassword) {
              var fetch_mobile = results[0].mobile;
              var fetch_email = results[0].email;
              var fetch_user_id = results[0].user_id;
              testimg(fetch_mobile, otp);
              testingmailer(fetch_email, otp);
              // //console.log(typeof psw)
              connection.query(
                "UPDATE `user` SET `otp`='" +
                  otp +
                  "' WHERE user_id='" +
                  fetch_user_id +
                  "' ",
                (err, rows) => {
                  if (err) {
                    res
                      .status(StatusCodes.INTERNAL_SERVER_ERROR)
                      .json({ message: err });
                  } else {
                    res.status(StatusCodes.OK).json({
                      resCode: "105",
                      message: "otp send in your registred mobile no and email",
                    });
                  }
                }
              );
            } else {
              res.send({ resCode: "102", message: "password not matched" });
            }
          } else {
            res.send({ resCode: "103", message: "Email not found" });
          }
        }
      }
    );
  } else {
    res.send({ resCode: "104", message: "please fill input" });
  }
};

export const user_otp_verify = async (req, res) => {
  var { otp } = req.body;

  if (otp) {
    connection.query(
      'SELECT `user_id`,`loginID`,`role`,`name`, `email` , `password` FROM `user`  WHERE `otp` ="' +
        otp +
        '"  ',
      async (err, results) => {
        if (err) {
          //console.log(err)
          res.send(err);
        } else {
          if (results != "") {
            jwt.sign(
              { id: results[0].user_id },
              process.env.ADMIN_JWT_SECRET_KEY,
              function (err, token) {
                //console.log(token);
                if (err) {
                }
                res.send({
                  resCode: "101",
                  userDetail: results,
                  status: true,
                  token: token,
                });
              }
            );
          } else {
            res.send({ resCode: "103", message: "otp not matched" });
          }
        }
      }
    );
  } else {
    res.send({ resCode: "104", message: "please fill otp" });
  }
};

export const userDeleteById = (req, res) => {
  const userId = req.query.id;

  connection.query(
    "DELETE FROM user WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    }
  );
};
