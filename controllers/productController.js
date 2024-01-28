import connection from "../Db.js";
import { StatusCodes } from "http-status-codes";

// Assuming you've set up your Express app and database connection as before

export const CreateProduct = async (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;

  // Check if any of the required fields are missing in the request body
  if (!name || !description || !price || !quantity || !category_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }

  connection.query(
    "INSERT INTO products (name, description, price, quantity, category_id) VALUES (?, ?, ?, ?, ?)",
    [name, description, price, quantity, category_id],
    (err, result) => {
      if (err) {
        throw err;
      }

      return res.status(StatusCodes.OK).json({
        message: "Product created successfully",
        productId: result.insertId,
      });
    }
  );
};

export const GetAllProduct = (req, res) => {
  connection.query("SELECT * FROM  productview ", (err, results) => {
    if (err) {
      throw err;
    }

    // If there are no products in the database
    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No products found" });
    }
    results.forEach((item) => {
      item.NewProductName = {
        name: item.productName,
        category: item.CategoryName,
        parentCategory: item.ParentCategoryName,
        image: item.product_image,
      }; // Assigning the subject "Math", change it as needed
    });
    res.status(StatusCodes.OK).json(results); // Return all products
  });
};

export const getProductById = (req, res) => {
  const productId = req.query.id;

  connection.query(
    "SELECT * FROM productview  WHERE product_id = ?",
    [productId],
    (err, results) => {
      if (err) {
        throw err;
      }

      // If the product with the given ID is not found
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const product = results[0]; // Assuming product_id is unique
      res.status(200).json(product); // Return the product details
    }
  );
};

export const productUpdate = (req, res) => {
  const productId = req.query.id;
  const { name, description, price, quantity, category_id } = req.body;

  // Check if any of the required fields are missing in the request body
  if (!name || !description || !price || !quantity || !category_id) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  connection.query(
    "UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category_id = ? WHERE product_id = ?",
    [name, description, price, quantity, category_id, productId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.changedRows === 0) {
        return res
          .status(404)
          .json({ message: "Product not found or no changes made" });
      }

      return res.status(200).json({ message: "Product updated successfully" });
    }
  );
};

export const productDeleteById = (req, res) => {
  const productId = req.query.id;

  connection.query(
    "DELETE FROM products WHERE product_id = ?",
    [productId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    }
  );
};

export const SearchProuduct = (req, res) => {
  const { productName, minPrice, maxPrice, category } = req.query;
  let query = "SELECT * FROM products WHERE 1 = 1";

  const queryParams = [];

  if (productName) {
    query += " AND name LIKE ?";
    queryParams.push(`%${productName}%`);
  }

  if (minPrice) {
    query += " AND price >= ?";
    queryParams.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    query += " AND price <= ?";
    queryParams.push(parseFloat(maxPrice));
  }

  if (category) {
    query += " AND category_id = ?";
    queryParams.push(category);
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(results); // Return filtered products
  });
};

export const addProuductImage = (req, res) => {
  const imagePath = req.file.filename; //
  let result =
    "" +
    req.protocol +
    "://" +
    req.headers.host +
    "/upload/" +
    req.file.filename;

  const productId = req.query.id;

  // Check if any of the required fields are missing in the request body
  if (!imagePath || !productId) {
    return res
      .status(400)
      .json({ message: "Please fill field first like id and image" });
  }

  connection.query(
    "UPDATE products SET product_image = ? WHERE product_id = ?",
    [result, productId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.changedRows === 0) {
        return res
          .status(404)
          .json({ message: "Product not found or no changes made" });
      }

      return res.status(200).json({ message: "product  Image uploaded" });
    }
  );
};
