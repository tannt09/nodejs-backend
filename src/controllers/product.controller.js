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
}

module.exports = new ProductsController();