const { v4: uuidv4 } = require("uuid");
const { client } = require("../databases/init.pg");

class GoodsController {
  async getAll(req, res, ___) {
    client.query("SELECT * FROM goods ORDER BY id ASC", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
      } else {
        res.json(result.rows);
      }
    });
  }

  async getFeatured(req, res, ___) {
    client.query(
      "SELECT * FROM goods WHERE featured = TRUE ORDER BY id ASC",
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error fetching data");
        } else {
          res.json(result.rows);
        }
      }
    );
  }

  async getMostPopular(req, res, ___) {
    client.query(
      "SELECT * FROM public.goods WHERE most_popular = TRUE ORDER BY id ASC",
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error fetching data");
        } else {
          res.json(result.rows);
        }
      }
    );
  }

  async add(req, res, ___) {
    const newId = uuidv4();
    const newInfoProduct = req.body;

    client.query(
      "INSERT INTO goods (product_id, image_url, is_favorite, name, price) VALUES ($1, $2, $3, $4, $5)",
      [
        newId,
        newInfoProduct.image_url,
        newInfoProduct.is_favorite,
        newInfoProduct.name,
        newInfoProduct.price,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error add new products");
        } else {
          res.send("Add new product successfully");
        }
      }
    );
  }

  async changeFavorite(req, res, ___) {
    const productId = req.query.user_id;
    const newFavoriteState = req.body.is_favorite;

    const queryText = `UPDATE goods SET is_favorite = $2 WHERE product_id = $1`;

    client.query(queryText, [productId, newFavoriteState], (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send(newFavoriteState ? "Error add favorite" : "Error unfavorite");
      } else {
        res.send(
          newFavoriteState
            ? "Add favorite successfully"
            : "Unfavorite successfully"
        );
      }
    });
  }
}

module.exports = new GoodsController();
