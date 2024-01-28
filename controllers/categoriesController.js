import connection from "../Db.js";

export const CreateCategory = async (req, res) => {
  const { name, description, parent_category_id } = req.body;

  let Perent_categoryId = parent_category_id !== "" ? parent_category_id : null;
  // Check if any of the required fields are missing in the request body
  if (!name || !description) {
    return res.status(400).json({
      message: "Please provide name and description for the category",
    });
  }

  connection.query(
    "INSERT INTO categories (name, description, parent_category_id ) VALUES (?, ?,?)",
    [name, description, Perent_categoryId],
    (err, result) => {
      if (err) {
        throw err;
      }

      res.status(201).json({
        message: "Category created successfully",
        categoryId: result.insertId,
      });
    }
  );
};

export const GetAllCategory = (req, res) => {
  connection.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.status(200).json(results); // Return all categories
  });
};

export const getCategoryById = (req, res) => {
  const categoryId = req.query.id;

  connection.query(
    "SELECT * FROM categories WHERE category_id = ?",
    [categoryId],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Category not found" });
      }

      const category = results[0]; // Assuming category_id is unique
      res.status(200).json(category); // Return the category details
    }
  );
};

export const updateCategory = (req, res) => {
  const categoryId = req.query.id;
  const { name, description, parent_category_id } = req.body;
  let Perent_categoryId = parent_category_id !== "" ? parent_category_id : null;
  // Check if any of the required fields are missing in the request body
  if (!name || !description) {
    return res.status(400).json({
      message: "Please provide name and description for the category",
    });
  }

  connection.query(
    "UPDATE categories SET name = ?, description = ?,parent_category_id =? WHERE category_id = ?",
    [name, description, Perent_categoryId, categoryId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.changedRows === 0) {
        return res
          .status(404)
          .json({ message: "Category not found or no changes made" });
      }

      res.status(200).json({ message: "Category updated successfully" });
    }
  );
};

export const deleteCategory = (req, res) => {
  const categoryId = req.query.id;

  connection.query(
    "DELETE FROM categories WHERE category_id = ?",
    [categoryId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({ message: "Category deleted successfully" });
    }
  );
};

export const getCategoryByProductID = (req, res) => {
  const categoryId = req.query.id;

  connection.query(
    "SELECT * FROM products WHERE category_id = ?",
    [categoryId],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found for this category" });
      }

      res.status(200).json(results); // Return products belonging to the category
    }
  );
};
