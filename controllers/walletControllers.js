import connection from "../Db.js";
import { StatusCodes } from "http-status-codes";

import "dotenv/config";

export const addFunds = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    connection.query(
      "SELECT balance FROM wallets WHERE user_id = ?",
      [userId],
      async (err, userWallet) => {
        if (err) {
          console.log(err);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
        } else {
          if (userWallet && userWallet.length > 0) {
            const currentBalance =
              Number(userWallet[0].balance) + Number(amount);

            connection.query(
              "UPDATE wallets SET balance = ? WHERE user_id = ?",
              [currentBalance, userId],
              (err, rows) => {
                if (err) {
                  res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Failed to add funds" });
                } else {
                  connection.query(
                    "SELECT * FROM wallets WHERE user_id = ?",
                    [userId],
                    (err, rows) => {
                      if (err) {
                        res
                          .status(StatusCodes.INTERNAL_SERVER_ERROR)
                          .json({ message: "Something went wrong" });
                      } else {
                        res.status(StatusCodes.OK).json({
                          message: "Add Wallet Money Successfully",
                          data: rows,
                        });
                      }
                    }
                  );
                }
              }
            );
          } else {
            res
              .status(StatusCodes.NOT_FOUND)
              .json({ message: "User wallet not found" });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export const sendMoney = async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    connection.query(
      "SELECT balance FROM wallets WHERE user_id = ?",
      [senderId],
      async (err, senderWallet) => {
        if (err) {
          console.log(err);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
        } else {
          if (senderWallet && senderWallet.length > 0) {
            const senderBalance = senderWallet[0].balance;

            if (senderBalance >= amount) {
              connection.beginTransaction(async (err) => {
                if (err) {
                  res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Transaction failed" });
                } else {
                  connection.query(
                    "SELECT balance FROM wallets WHERE user_id = ?",
                    [receiverId],
                    async (err, receiverWallet) => {
                      if (err) {
                        res
                          .status(StatusCodes.INTERNAL_SERVER_ERROR)
                          .json({ message: "Something went wrong" });
                      } else {
                        if (receiverWallet && receiverWallet.length > 0) {
                          try {
                            await connection.query(
                              "UPDATE wallets SET balance = balance - ? WHERE user_id = ?",
                              [amount, senderId]
                            );

                            await connection.query(
                              "UPDATE wallets SET balance = balance + ? WHERE user_id = ?",
                              [amount, receiverId]
                            );

                            connection.commit((err) => {
                              if (err) {
                                connection.rollback(() => {
                                  res
                                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                                    .json({ message: "Transaction failed" });
                                });
                              } else {
                                connection.query(
                                  `SELECT
                                    (SELECT name FROM user WHERE user_id = ?) AS sender_name,
                                    (SELECT name FROM user WHERE user_id = ?) AS receiver_name`,
                                  [senderId, receiverId],

                                  (err, transactions) => {
                                    if (err) {
                                      console.log(err);
                                      res.status(500).json({
                                        message: "Failed to create transaction",
                                      });
                                    } else {
                                      let SenderName =
                                        transactions[0].sender_name;
                                      let ReceiverName =
                                        transactions[0].receiver_name;
                                      connection.query(
                                        "SELECT balance FROM wallets WHERE user_id = ?",
                                        [senderId],
                                        (err, receiverWallet) => {
                                          if (err) {
                                            res
                                              .status(
                                                StatusCodes.INTERNAL_SERVER_ERROR
                                              )
                                              .json({
                                                message: "Something went wrong",
                                              });
                                          } else {
                                            res.status(StatusCodes.OK).json({
                                              message:
                                                "money SuccessFully Transfred",
                                              data: {
                                                senderName: SenderName,
                                                receiverName: ReceiverName,
                                                currentBalance:
                                                  receiverWallet[0].balance,
                                              },
                                            });
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            });
                          } catch (error) {
                            connection.rollback(() => {
                              console.error(error);
                              res
                                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                                .json({ message: "Transaction failed" });
                            });
                          }
                        } else {
                          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                            message:
                              "Receiver Wallet not found Please create wallet first",
                          });
                        }
                      }
                    }
                  );
                }
              });
            } else {
              res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Insufficient balance" });
            }
          } else {
            res
              .status(StatusCodes.NOT_FOUND)
              .json({ message: "Sender wallet not found" });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export const withdrawFunds = (req, res) => {
  const { userId, amount } = req.body;

  connection.query(
    "SELECT balance FROM wallets WHERE user_id = ?",
    [userId],
    (err, userWallet) => {
      if (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something went wrong" });
      } else {
        if (userWallet && userWallet.length > 0) {
          const currentBalance = userWallet[0].balance;

          if (currentBalance >= amount) {
            connection.query(
              "UPDATE wallets SET balance = balance - ? WHERE user_id = ?",
              [amount, userId],
              (err) => {
                if (err) {
                  res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Failed to withdraw funds" });
                } else {
                  res
                    .status(StatusCodes.OK)
                    .json({ message: "Funds withdrawn successfully" });
                }
              }
            );
          } else {
            res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: "Insufficient balance" });
          }
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "User wallet not found" });
        }
      }
    }
  );
};

export const createWallet = (req, res) => {
  var { user_id } = req.body;
  try {
    connection.query(
      "SELECT * FROM user WHERE user_id = ?",
      [user_id],
      (err, user) => {
        if (err) {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
        } else {
          if (user && user.length > 0) {
            connection.query(
              "SELECT * FROM wallets  WHERE user_id = ?",
              [user_id],
              (err, user) => {
                if (user && user.length > 0) {
                  res.status(StatusCodes.OK).json({ message: user });
                } else {
                  connection.query(
                    "insert into wallets  (`user_id`) VALUES('" +
                      user_id +
                      "' ) ",
                    (err, rows) => {
                      if (err) {
                        res
                          .status(StatusCodes.INTERNAL_SERVER_ERROR)
                          .json({ message: "something went wrong" });
                      } else {
                        if (rows.affectedRows == 1) {
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
                                if (userWallet && userWallet.length > 0) {
                                  res.status(StatusCodes.OK).json({
                                    message: "new Wallet Creaed",
                                    data: userWallet,
                                  });
                                }
                              }
                            }
                          );
                        } else {
                          res
                            .status(StatusCodes.INTERNAL_SERVER_ERROR)
                            .json({ message: "Wallet not created" });
                        }
                      }
                    }
                  );
                }
              }
            );
          } else {
            res.status(StatusCodes.OK).json({ message: "user not found" });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export const showAllWallet = (req, res) => {
  try {
    connection.query("SELECT * FROM wallets", (err, user) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(user);
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};
