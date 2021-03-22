DROP DATABASE IF EXISTS reviewdb;

CREATE DATABASE reviewdb;

\c reviewdb;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id integer NOT NULL,
  rating integer NOT NULL,
  date date,
  summary varchar(500),
  body varchar(1000),
  recommend boolean,
  reported boolean,
  reviewer_name varchar(100),
  reviewer_email varchar(100),
  response varchar(1000),
  helpfulness integer
);

--MAYBE add another table to hold counts of review characteristics and recommendations? Down the road...

CREATE TABLE characteristic_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  characteristic_id integer,
  review_id integer NOT NULL,
  value integer
);


CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id integer NOT NULL,
  name varchar(50)
);

CREATE TABLE reviews_photos (
  id SERIAL PRIMARY KEY NOT NULL,
  review_id integer NOT NULL,
  url varchar(200)
);


-- CREATE INTERMEDIATE TABLES
CREATE TABLE intermediate_reviews (
  id SERIAL PRIMARY KEY,
  product_id integer NOT NULL,
  rating integer NOT NULL,
  date date,
  summary varchar(500),
  body varchar(1000),
  recommend boolean,
  reported boolean,
  reviewer_name varchar(100),
  reviewer_email varchar(100),
  response varchar(1000),
  helpfulness integer
);

CREATE TABLE intermediate_characteristic_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  characteristic_id integer,
  review_id integer NOT NULL,
  value integer
);

CREATE TABLE intermediate_characteristics (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id integer NOT NULL,
  name varchar(50)
);

CREATE TABLE intermediate_reviews_photos (
  id SERIAL PRIMARY KEY NOT NULL,
  review_id integer NOT NULL,
  url varchar(200)
);

-- COPY intermediate_reviews
-- FROM '/home/baja/SDC/reviews/database/test.csv' --path to file
-- DELIMITER ','
-- CSV HEADER;

-- INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
-- (SELECT product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness FROM intermediate_reviews);

-- DROP TABLE intermediate_reviews;

COPY intermediate_reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/baja/SDC/reviews/database/reviews.csv' --path to file
DELIMITER ','
CSV HEADER;

COPY intermediate_characteristic_reviews(id, characteristic_id, review_id, value)
FROM '/home/baja/SDC/reviews/database/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY intermediate_characteristics(id, product_id, name)
FROM '/home/baja/SDC/reviews/database/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY intermediate_reviews_photos(id, review_id, url)
FROM '/home/baja/SDC/reviews/database/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
(SELECT product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness FROM intermediate_reviews);

INSERT INTO characteristic_reviews (characteristic_id, review_id, value)
(SELECT characteristic_id, review_id, value FROM intermediate_characteristic_reviews);

INSERT INTO characteristics (product_id, name)
(SELECT product_id, name FROM intermediate_characteristics);

INSERT INTO reviews_photos (review_id, url)
(SELECT review_id, url FROM intermediate_reviews_photos);

DROP TABLE intermediate_reviews;
DROP TABLE intermediate_characteristic_reviews;
DROP TABLE intermediate_characteristics;
DROP TABLE intermediate_reviews_photos;

CREATE INDEX reviews_product_id_idx
ON reviews (product_id);

CREATE INDEX reviews_rating_idx
ON reviews (rating);

CREATE INDEX reviews_recommend_idx
ON reviews (recommend);

CREATE INDEX characteristics_product_id_idx
ON characteristics (product_id);

CREATE INDEX characteristic_reviews_characteristic_id_idx
ON characteristic_reviews (characteristic_id);

-- su postgres
-- psql < database/schema.sql

-- To get into db:
-- psql -d reviewdb
