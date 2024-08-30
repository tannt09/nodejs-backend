const { v4: uuidv4 } = require("uuid");
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

    client.query(
      "UPDATE products SET original_price = $1 WHERE id = $2",
      [newOriginPrice, productsId],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error updating data");
        } else {
          res.send("Price updated successfully");
        }
      }
    );
  }

  async add(req, res, ___) {
    const newId = uuidv4();
    const newInfoProduct = req.body;

    client.query(
      "INSERT INTO products (id, title, description, discount_percentage, original_price, discounted_price) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        newId,
        newInfoProduct.title,
        newInfoProduct.description,
        newInfoProduct.discount_percentage,
        newInfoProduct.original_price,
        newInfoProduct.discounted_price,
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

  async deleteProduct(req, res, ___) {
    const productId = req.query.id;

    client.query(
      "DELETE FROM products WHERE id = $1",
      [productId],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error delete product");
        } else {
          res.send("Delete product successfully");
        }
      }
    );
  }
}

module.exports = new ProductsController();
