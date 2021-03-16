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
  console.log(product_id);
  query = await sql`SELECT * FROM reviews WHERE product_id=${product_id}`;
  return query;
};

// GET to /reviews/meta
const getReviewsMeta = async () => {
  return ('successful GET to /reviews/meta');
};

// POST to /reviews
const postReview = async () => { // does this need to be async?
  return ('successful POST to /reviews');
};

// PUT to /reviews/:review_id/helpful
const putReviewHelpful = async () => {
  return ('successful PUT to /reviews/:review_id/helpful');
};

// PUT to /reviews/:review_id/report
const putReviewReport = async () => {
  return ('successful PUT to /reviews/:review_id/report');
};

module.exports = {
  getReviews: getReviews,
  getReviewsMeta: getReviewsMeta,
  postReview: postReview,
  putReviewHelpful: putReviewHelpful,
  putReviewReport: putReviewReport
};
