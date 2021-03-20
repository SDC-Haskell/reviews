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
const getReviews = async (product_id, page = 1, count = 5) => {
  let reviewData = await sql`
  SELECT DISTINCT
    reviews_photos.review_id,
    reviews.rating,
    reviews.summary,
    reviews.recommend,
    reviews.response,
    reviews.body,
    reviews.date,
    reviews.reviewer_name,
    reviews.helpfulness
  FROM reviews_photos, reviews
  WHERE (reviews.product_id=${product_id} AND reviews.id=reviews_photos.review_id)`;

  let photos = await sql`
  SELECT reviews_photos.id, reviews_photos.review_id, reviews_photos.url
  FROM reviews_photos, reviews
  WHERE (reviews.product_id=${product_id} AND reviews.id=reviews_photos.review_id)`;

  for (let i = 0; i < reviewData.length; i++) {
    reviewData[i].photos = [];
    for (let j = 0; j < photos.length; j++) {
      if (reviewData[i].review_id === photos[j].review_id) {
        if (photos[j].url === ''){
          break;
        } else {
          reviewData[i].photos.push({id: photos[j].id, url: photos[j].url});
        }
      }
    }
  }

  reviewData = reviewData.slice(count * (page - 1), (count * page));

  return reviewData;
};



// GET to /reviews/meta
const getReviewsMeta = async (product_id) => {

  let ratingCounts = await sql`
  WITH product_ratings AS (
    SELECT rating, recommend
    FROM reviews
    WHERE product_id=${product_id}
  )
SELECT
(SELECT COUNT(*) FROM product_ratings WHERE rating=1) as ones,
(SELECT COUNT(*) FROM product_ratings WHERE rating=2) as twos,
(SELECT COUNT(*) FROM product_ratings WHERE rating=3) as threes,
(SELECT COUNT(*) FROM product_ratings WHERE rating=4) as fours,
(SELECT COUNT(*) FROM product_ratings WHERE rating=5) as fives,
(SELECT COUNT(*) FROM product_ratings WHERE recommend='true') as trues,
(SELECT COUNT(*) FROM product_ratings WHERE recommend='false') as falses
FROM product_ratings
ORDER BY rating
`

  let chars = await sql`
  WITH current AS (
    SELECT DISTINCT
      characteristics.name,
      characteristic_reviews.characteristic_id
    FROM characteristics, characteristic_reviews
    WHERE characteristics.product_id = ${product_id}
    AND characteristic_reviews.characteristic_id = characteristics.id
    )
  SELECT
    current.name,
    current.characteristic_id AS id,
    (SELECT AVG(value) AS value
      FROM characteristic_reviews, characteristics
      WHERE current.characteristic_id=characteristic_reviews.characteristic_id)
  FROM current`
  let charObj = {};
  for (let i = 0; i < chars.length; i++) {
    charObj[chars[i].name] = {id: chars[i].id, value: chars[i].value}
  }

  let data = {
    product_id: product_id,
    ratings: {
      1: ratingCounts[0].ones,
      2: ratingCounts[0].twos,
      3: ratingCounts[0].threes,
      4: ratingCounts[0].fours,
      5: ratingCounts[0].fives
    },
    recommended: {
      false: ratingCounts[0].falses,
      true: ratingCounts[0].trues
    },
    characteristics: charObj
  }
  for (let i = 1; i <= 5; i++) {
    if (data.ratings[i] === 0) {
      delete data.ratings[i];
    }
  }

  return data;
};

// POST to /reviews
const postReview = async (body) => { // does this need to be async?
  let currentDate = new Date();
  // let urlStatement = '';
  // let urlArray = [body.url1, body.url2, body.url3, body.url4, body.url5];
  // for (let i = 0; i < urlArray.length; i++) {
  //   if (urlArray[i] === '') {
  //     break;
  //   }
  //   if (i !== 0) {
  //     urlStatement += ', ';
  //   }
  //   urlStatement += "((SELECT id FROM new_review), '" + urlArray[i] + "')";
  // }
  // console.log(urlStatement);
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
  INSERT INTO reviews_photos (review_id, url)
  VALUES
  ((SELECT id FROM new_review), ${body.url1}),
  ((SELECT id FROM new_review), ${body.url2}),
  ((SELECT id FROM new_review), ${body.url3}),
  ((SELECT id FROM new_review), ${body.url4}),
  ((SELECT id FROM new_review), ${body.url5})`;
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
