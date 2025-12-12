const express = require("express");
const app = express();

// Allow cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const port = 3000;

const products = [
  { id: 1, name: "Product 1", reviews: [] },
  { id: 2, name: "Product 2", reviews: [] },
  { id: 3, name: "Product 3", reviews: [] },
  { id: 4, name: "Product 4", reviews: [] },
];

app.get("/products", (req, res) => {
  res.send(products);
});

// POST /products/:id/reviews
app.post("/products/:id/reviews", (req, res) => {
  const productId = req.params.id;

  const review = req.body;

  // Validate data
  if (
    !review ||
    !(review.rating >= 1 && review.rating <= 5) ||
    !review.comment.trim()
  ) {
    return res.status(400).json({ error: "Invalid review data" });
  }

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === Number(productId)) {
      products[i].reviews.unshift({ id: Date.now(), ...review });
    }
  }

  res.send(products);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = { app, products };

// { reviewer: string, rating: number (1-5), comment: string }
// curl --json '{"reviewer": "Alfredo Sumaran", "rating": 1, "comment": "my comment"}' -X POST http://localhost:3000/products/2/reviews
