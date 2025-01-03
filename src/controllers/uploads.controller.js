const { client } = require("../databases/init.pg");

class UploadsController {
  async uploadImage(req, res, ___) {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    const queryText = "INSERT INTO images (url) VALUES ($1) RETURNING id";

    client.query(queryText, [imageUrl], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error upload image");
      } else {
        res.send({ image_url: imageUrl, id: result.rows[0].id });
      }
    });
  }
}

module.exports = new UploadsController();
