const postgres = require('postgres');
const { dbUser, dbPass } = require('../config');

const sql = postgres({
  host: 'localhost', // IP
  port: 5432, // whatever port Postgres uses (this is default)
  database: 'reviewdb',
  username: dbUser,
  password: dbPass
});

// GET to /reviews
const getReviews = async (product_id) => {
  let query = await sql`SELECT * FROM reviews WHERE product_id=${product_id}`;
  return query;
};

// GET to /reviews/meta
const getReviewsMeta = async (product_id) => {
  let query = await sql`SELECT rating FROM reviews WHERE product_id=${product_id}`;
  return query;
};

// POST to /reviews
const postReview = async (body) => { // does this need to be async?
  let currentDate = new Date();
  return await sql`
  WITH new_review AS (
    INSERT INTO reviews
    (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness)
    VALUES
    (${body.product_id},
    ${body.rating},
    ${currentDate},
    ${body.summary},
    ${body.body},
    ${body.recommend},
    false,
    ${body.name},
    ${body.email},
    0)
    RETURNING id
  )
  INSERT INTO reviews_photos (review_id, url) VALUES ((SELECT id FROM new_review), ${body.url})
  `;
};

// PUT to /reviews/:review_id/helpful
const putReviewHelpful = (review_id) => {
  return sql`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id}`;
};

// PUT to /reviews/:review_id/report
const putReviewReport = (review_id) => {
  return sql`UPDATE reviews SET reported='true' WHERE id=${review_id}`;
};

module.exports = {
  getReviews: getReviews,
  getReviewsMeta: getReviewsMeta,
  postReview: postReview,
  putReviewHelpful: putReviewHelpful,
  putReviewReport: putReviewReport
};
