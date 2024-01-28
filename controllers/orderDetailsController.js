import connection from "../Db.js";

export const createOrderDetails = async (req, res) => {
  const orderId = req.query.order_id;
  const { user_id, product_id, price, quantity } = req.body;

  // Validate required fields
  if (!user_id || !product_id || !quantity || !price) {
    return res.status(400).json({
      message: "Please provide product_id,user_id quantity, and price",
    });
  }

  // Insert order detail into the database
  connection.query(
    "INSERT INTO order_details (order_id, product_id, user_id, price,quantity) VALUES (?,?,?,?,?)",
    [orderId, product_id, user_id, price, quantity],
    (err, result) => {
      if (err) {
        throw err;
      }

      res.status(201).json({
        message: "Order detail added successfully",
        orderDetailId: result.insertId,
      });
    }
  );
};

export const getOrderDetailsByOrderId = async (req, res) => {
  const orderId = req.query.order_id;

  connection.query(
    "SELECT * FROM order_details WHERE order_id = ?",
    [orderId],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No order details found for this order" });
      }

      res.status(200).json(results); // Return order details associated with the order
    }
  );
};

export const orderDetailsUpdate = async (req, res) => {};
