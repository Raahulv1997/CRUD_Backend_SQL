import connection from "../Db.js";

export const addToCart = async (req, res) => {
  const { user_id, product_id, quantity, price } = req.body;

  // Validate required fields
  if (!user_id || !product_id || !quantity || !price) {
    return res
      .status(400)
      .json({ message: "Please provide user_id, product_id, and quantity" });
  }

  // Insert item into the 'cart' table
  connection.query(
    "INSERT INTO cart (user_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    [user_id, product_id, quantity, price],
    (err, result) => {
      if (err) {
        throw err;
      }

      res.status(201).json({
        message: "Product added to cart successfully",
        cartItemId: result.insertId,
      });
    }
  );
};

export const getCartByUserID = async (req, res) => {
  const userId = req.query.user_id;

  connection.query(
    "SELECT * FROM cart WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "User has no items in the cart" });
      }

      res.status(200).json(results); // Return items in the user's cart
    }
  );
};

export const updateCart = async (req, res) => {
  const cartId = req.query.cart_id;
  const { quantity, product_id } = req.body;

  // Validate required fields
  if (!quantity) {
    return res
      .status(400)
      .json({ message: "Please provide a quantity to update" });
  }
  const product = await getProductById(product_id);
  const availableQuantity = product.quantity;

  if (availableQuantity < quantity) {
    return res.status(400).json({
      message: `Not enough quantity available for Product ID ${product_id}`,
    });
  }
  // Update the quantity of the specified cart item
  connection.query(
    "UPDATE cart SET quantity = ? WHERE cart_id = ?",
    [quantity, cartId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.changedRows === 0) {
        return res
          .status(404)
          .json({ message: "Cart item not found or no changes made" });
      }

      res
        .status(200)
        .json({ message: "Cart item quantity updated successfully" });
    }
  );
};

export const RemoveFromCart = async (req, res) => {
  const cartId = req.query.cart_id;

  // Delete the specified item from the user's cart
  connection.query(
    "DELETE FROM cart WHERE cart_id = ?",
    [cartId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Cart item not found or already deleted" });
      }

      res.status(200).json({ message: "Cart item removed successfully" });
    }
  );
};

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
