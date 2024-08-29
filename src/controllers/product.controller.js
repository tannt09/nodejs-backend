const { client } = require("../databases/init.pg");

class ProductsController {
  async getAll(req, res, ___) {
    client.query("SELECT * FROM products", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
      } else {
        res.json(result.rows);
      }
    });
  }

  async update(req, res, ___) {
    const productsId = req.query.id;
    const newOriginPrice = req.body.price;

    client.query("UPDATE products SET original_price = $1 WHERE id = $2", [newOriginPrice, productsId],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error updating data");
        } else {
          res.send("Price updated successfully")
        }
      }
    )
  }
}

module.exports = new ProductsController();