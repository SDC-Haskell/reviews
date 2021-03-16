const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const db = require('../database/database');

// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/reviews/', (req, res) => {
  console.log(req.query);
  db.getReviews(req.query.product_id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.get('/reviews/meta/', (req, res) => {
  db.getReviewsMeta()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.post('/reviews/', (req, res) => {
  db.postReview()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  db.putReviewHelpful()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.put('/reviews/:review_id/report', (req, res) => {
  db.putReviewReport()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});