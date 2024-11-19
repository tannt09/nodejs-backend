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
}

module.exports = new GoodsController();
