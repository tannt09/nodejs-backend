const { v4: uuidv4 } = require("uuid");
const { client } = require("../databases/init.pg");

class GoodsController {
  async getAll(req, res, ___) {
    client.query("SELECT * FROM goods", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
      } else {
        res.json(result.rows);
      }
    });
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
}

module.exports = new GoodsController();
