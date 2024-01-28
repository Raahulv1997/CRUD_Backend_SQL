import connection from "../Db.js";
import { StatusCodes } from "http-status-codes";

import "dotenv/config";

export const getTransactionHistory = (req, res) => {
  const { userId } = req.body;

  connection.query(
    "SELECT * FROM transactions WHERE sender_id = ? OR receiver_id = ? ORDER BY transaction_date DESC",
    [userId, userId],
    (err, transactions) => {
      if (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something went wrong" });
      } else {
        if (transactions && transactions.length > 0) {
          res.status(StatusCodes.OK).json({ userId, transactions });
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "No transactions found for the user" });
        }
      }
    }
  );
};

export const getTransactionDetails = (req, res) => {
  var { transactionId } = req.body;

  connection.query(
    "SELECT * FROM transactions WHERE transaction_id = ?",
    [transactionId],
    (err, transaction) => {
      if (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something went wrong" });
      } else {
        if (transaction && transaction.length > 0) {
          res.status(StatusCodes.OK).json({ transaction });
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Transaction not found" });
        }
      }
    }
  );
};

export const getTransactionDetailsBYUserID = (req, res) => {
  var { userId } = req.body;

  connection.query(
    "SELECT * FROM transactions WHERE sender_id = ? OR receiver_id=? ORDER BY transaction_date DESC",
    [userId, userId],
    (err, transaction) => {
      if (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something went wrong" });
      } else {
        if (transaction && transaction.length > 0) {
          res.status(StatusCodes.OK).json({ data: transaction });
        } else {
          res.status(StatusCodes.OK).json({ message: "Transaction not found" });
        }
      }
    }
  );
};
export const createTransaction = async (req, res) => {
  const {
    referance_id,
    transactionId,
    receiverId,
    senderId,
    amount,
    status,
    transactionType,
    description,
  } = req.body;
  connection.query(
    `SELECT
      (SELECT name FROM user WHERE user_id = ?) AS sender_name,
      (SELECT name FROM user WHERE user_id = ?) AS receiver_name`,
    [senderId, receiverId],

    (err, transactions) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create transaction" });
      } else {
        let SenderName = transactions[0].sender_name;
        let ReceiverName = transactions[0].receiver_name;
        connection.query(
          "INSERT INTO transactions (referance_id,transaction_id, sender_id, receiver_id, amount,status, senderName, receiverName, transaction_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)",
          [
            referance_id,
            transactionId,
            senderId,
            receiverId,
            amount,
            status,
            SenderName,
            ReceiverName,
            transactionType,
            description,
          ],
          (err, rows) => {
            if (err) {
              console.log(err);
              res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Something went wrong" });
            } else {
              res
                .status(StatusCodes.OK)
                .json({ message: "transaction created" });
            }
          }
        );
      }
    }
  );
};
