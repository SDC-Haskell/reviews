const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const db = require('../database/database');

// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('root');
});

app.get('/reviews/', (req, res) => {
  db.getReviews(req.query.product_id,  req.query.page,  req.query.count)
    .then((data) => {
      let dataObject = {
        product: req.query.product_id,
        page: req.query.page || 1,
        count: req.query.count || 5,
        results: data
      }
      res.status(200).send(dataObject);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.get('/reviews/meta/', (req, res) => {
  db.getReviewsMeta(req.query.product_id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.post('/reviews/', (req, res) => {
  db.postReview(req.body)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  db.putReviewHelpful(req.params.review_id) // double check
    .then((data) => {
      res.status(204).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.put('/reviews/:review_id/report', (req, res) => {
  db.putReviewReport(req.params.review_id)
    .then((data) => {
      res.status(204).send(data);
    })
    .catch((err) => {
      res.status(402).send(err);
    })
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});