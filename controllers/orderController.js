import connection from "../Db.js";

export const createOrder = async (req, res) => {
  const { user_id, total_amount, total_order_quantity } = req.body;

  // Validate required fields
  if (!user_id || !total_amount || !total_order_quantity) {
    return res
      .status(400)
      .json({ message: "Please provide all required order details" });
  }

  // Assuming 'orders' table has appropriate fields and 'users', 'products' tables exist
  // Perform database operations to create a new order entry
  connection.query(
    "INSERT INTO orders (user_id, total_amount, total_order_quantity) VALUES (?,?,?)",
    [user_id, total_amount, total_order_quantity],
    (err, result) => {
      if (err) {
        throw err;
      }

      res.status(201).json({
        message: "Order placed successfully",
        orderId: result.insertId,
      });
    }
  );
};

export const getAllorder = async (req, res) => {
  connection.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(results); // Return all orders
  });
};

export const getSingleOrder = async (req, res) => {
  const orderId = req.query.id;

  connection.query(
    "SELECT * FROM orders WHERE order_id = ?",
    [orderId],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      const order = results[0]; // Assuming order_id is unique
      res.status(200).json(order); // Return the order details
    }
  );
};

export const orderStatusChange = async (req, res) => {
  const orderId = req.query.order_id;
  const { status } = req.body;

  // Validate required fields
  if (!status) {
    return res
      .status(400)
      .json({ message: "Please provide a status to update" });
  }

  // Update order status in the database
  connection.query(
    "UPDATE orders SET status = ? WHERE order_id = ?",
    [status, orderId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.changedRows === 0) {
        return res
          .status(404)
          .json({ message: "Order not found or no changes made" });
      }

      res.status(200).json({ message: "Order status updated successfully" });
    }
  );
};

export const getOrderByUserId = async (req, res) => {
  const userId = req.query.user_id;

  connection.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No orders found for this user" });
      }

      res.status(200).json(results); // Return orders associated with the user
    }
  );
};

export const deleteOrder = async (req, res) => {
  const orderId = req.query.order_id;

  connection.query(
    "DELETE FROM orders WHERE order_id = ?",
    [orderId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order deleted successfully" });
    }
  );
};

export const orderPlaceNew = async (req, res) => {
  const { userId, order } = req.body;
  var order_id = Math.floor(100000 + Math.random() * 900000);
  let totalOrderAmount = 0;
  let totalOrderQuantity = 0;

  try {
    for (const item of order) {
      const { productId, quantity, amount } = item;

      const product = await getProductById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} does not exist.` });
      }

      const availableQuantity = product.quantity;

      if (availableQuantity < quantity) {
        return res.status(400).json({
          message: `Not enough quantity available for Product ID ${productId}`,
        });
      }

      const updatedQuantity = availableQuantity - quantity;

      // Update product quantity in the database
      await updateProductQuantity(productId, updatedQuantity);

      totalOrderAmount += Number(amount);
      totalOrderQuantity += Number(quantity);
    }
    await insertOrder(
      userId,
      totalOrderAmount,
      totalOrderQuantity,
      order.length,
      order_id
    );

    //---------------------------------------

    for (const item of order) {
      const { productId, quantity, amount } = item;

      insertOrderDetails(order_id, userId, productId, quantity, amount);
    }

    //======================================================

    // Insert order into the orders table

    res.status(200).json({ message: "placed" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Functions for database operations (assuming these functions exist)

const getProductById = (productId) => {
  return new Promise((resolve, reject) => {
    const checkProductQuery = `SELECT * FROM products WHERE product_id = ${productId}`;
    connection.query(checkProductQuery, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
};

const updateProductQuantity = (productId, updatedQuantity) => {
  return new Promise((resolve, reject) => {
    const updateProductQuery = `UPDATE products SET quantity = ${updatedQuantity} WHERE product_id = ${productId}`;
    connection.query(updateProductQuery, (error, updateResult) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const insertOrder = (
  userId,
  totalOrderAmount,
  totalOrderQuantity,
  cartOTy,
  order_id
) => {
  const insertOrderQuery = `INSERT INTO orders (user_id, total_amount, total_order_quantity, total_cart_quantity,order_id) VALUES (${userId}, ${totalOrderAmount}, ${totalOrderQuantity},${cartOTy},${order_id})`;
  connection.query(insertOrderQuery, async (error, insertResult) => {
    if (error) {
      return error;
    } else {
      return insertResult;
    }
  });
};

const insertOrderDetails = (
  order_id,
  userId,
  productId,
  quantity,
  unit_price
) => {
  return new Promise((resolve, reject) => {
    const insertOrderQuery = `INSERT INTO order_details (order_id, user_id,product_id ,order_product_quantity,order_product_price) VALUES (${order_id}, ${userId}, ${productId},${quantity},${unit_price})`;

    connection.query(insertOrderQuery, (error, updateResult) => {
      if (error) {
        reject(error);
      } else {
        resolve();
        return updateResult;
      }
    });
  });
};
