import connection from "../Db.js";

export const AddProductReview = async (req, res) => {
  const { productId, user_id, rating, comment } = req.body;

  // Validate required fields
  if (!user_id || !rating) {
    return res
      .status(400)
      .json({ message: "Please provide user_id and rating" });
  }

  // Insert review into the 'reviews_ratings' table
  connection.query(
    "INSERT INTO reviews_ratings (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
    [productId, user_id, rating, comment],
    (err, result) => {
      if (err) {
        throw err;
      }

      res.status(201).json({
        message: "Review and rating added successfully",
        reviewId: result.insertId,
      });
    }
  );
};

export const getProductReviewByProductId = async (req, res) => {
  const productId = req.query.product_id;

  connection.query(
    "SELECT * FROM reviews_ratings WHERE product_id = ?",
    [productId],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No reviews found for this product" });
      }

      res.status(200).json(results); // Return reviews and ratings for the product
    }
  );
};

export const UpdateRating = async (req, res) => {
  const reviewId = req.query.review_id;
  const { rating, comment } = req.body;

  // Validate required fields
  if (!rating && !comment) {
    return res
      .status(400)
      .json({ message: "Please provide a rating or comment to update" });
  }

  // Construct the UPDATE query based on provided fields
  let updateQuery = "UPDATE reviews_ratings SET ";
  const queryParams = [];
  if (rating) {
    updateQuery += "rating = ?, ";
    queryParams.push(rating);
  }
  if (comment) {
    updateQuery += "comment = ?, ";
    queryParams.push(comment);
  }

  // Remove trailing comma and complete the query
  updateQuery = updateQuery.slice(0, -2); // Remove the last ', '
  updateQuery += " WHERE review_id = ?";
  queryParams.push(reviewId);

  // Execute the update query
  connection.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      throw err;
    }

    if (result.changedRows === 0) {
      return res
        .status(404)
        .json({ message: "Review not found or no changes made" });
    }

    res.status(200).json({ message: "Review updated successfully" });
  });
};

export const DeleteRating = async (req, res) => {
  const reviewId = req.query.review_id;

  // Delete the specified review/rating from the 'reviews_ratings' table
  connection.query(
    "DELETE FROM reviews_ratings WHERE review_id = ?",
    [reviewId],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Review not found or already deleted" });
      }

      res.status(200).json({ message: "Review deleted successfully" });
    }
  );
};
